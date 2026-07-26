import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { createPuzzlePdf, UnsupportedPdfTextError, validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import { isPuzzleOutputOptions, sanitizePuzzleFilename } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

export const runtime = "nodejs";

function pdfJsonError(message: string, status: 400 | 500) {
  const response = NextResponse.json({ error: message }, { status });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { puzzle?: unknown; options?: unknown; shareUrl?: unknown };
    if (!validatePuzzleForPdf(payload.puzzle)) {
      return pdfJsonError("The encoded puzzle data is invalid or incomplete.", 400);
    }
    if (!isPuzzleOutputOptions(payload.options)) {
      return pdfJsonError("The PDF paper or layout options are unsupported.", 400);
    }
    if (typeof payload.shareUrl !== "string") {
      return pdfJsonError("The puzzle share URL is missing.", 400);
    }
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(payload.shareUrl);
    } catch {
      return pdfJsonError("The puzzle share URL is invalid.", 400);
    }
    if (parsedUrl.hostname !== "www.ilovewordsearch.com"
      || !parsedUrl.pathname.startsWith("/play/")
      || payload.shareUrl !== puzzlePlayUrl(payload.puzzle.request)) {
      return pdfJsonError("The puzzle share URL is not supported.", 400);
    }

    const qrDataUrl = payload.options.qrCode
      ? await QRCode.toDataURL(payload.shareUrl, { margin: 4, width: 256, errorCorrectionLevel: "M" })
      : undefined;
    const bytes = await createPuzzlePdf({
      puzzle: payload.puzzle,
      options: payload.options,
      shareUrl: payload.shareUrl,
      qrDataUrl
    });
    if (!bytes.length) throw new Error("PDF generation returned an empty file.");
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizePuzzleFilename(payload.puzzle.request.title)}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow"
      }
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return pdfJsonError("The PDF request body is invalid.", 400);
    }
    if (error instanceof UnsupportedPdfTextError) {
      return pdfJsonError(error.message, 400);
    }
    console.error("Puzzle PDF generation failed", error instanceof Error ? error.message : "Unknown error");
    return pdfJsonError("The PDF could not be generated. Please retry.", 500);
  }
}
