import { NextResponse } from "next/server";
import { findSearchResults } from "@/lib/search/catalog";

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().slice(0, 160);
  const requestedLimit = Number(url.searchParams.get("limit"));
  const limit = Number.isInteger(requestedLimit) ? Math.min(12, Math.max(1, requestedLimit)) : 8;
  const response = NextResponse.json({
    results: query.length >= 2 ? findSearchResults(query, limit) : []
  });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
