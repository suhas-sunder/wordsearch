import { ImageResponse } from "next/og";

export const alt = "I Love Word Search";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function Image({ searchParams }: { searchParams?: Promise<{ title?: string }> }) {
  const query = searchParams ? await searchParams : {};
  const title = query.title ?? "I Love Word Search";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#172033", padding: 72 }}>
        <div style={{ display: "flex", gap: 56, alignItems: "center" }}>
          <div style={{ width: 360, height: 450, display: "flex", flexDirection: "column", border: "2px solid #d9dee7", borderRadius: 18, padding: 32, boxShadow: "0 16px 40px rgba(23,32,51,.08)" }}>
            <div style={{ fontSize: 28, color: "#1f7a4d", fontWeight: 900, marginBottom: 24 }}>WORD SEARCH</div>
            <div style={{ width: 292, display: "flex", flexWrap: "wrap", border: "2px solid #172033" }}>
              {Array.from({ length: 36 }, (_, index) => <div key={index} style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid #172033", borderBottom: "1px solid #172033", fontSize: 26, fontWeight: 900 }}>{["W", "O", "R", "D", "S", "A"][index % 6]}</div>)}
            </div>
          </div>
          <div style={{ width: 620, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, color: "#1f7a4d", fontWeight: 900 }}>www.iLoveWordSearch.com</div>
            <div style={{ fontSize: 74, lineHeight: 0.98, fontWeight: 900, marginTop: 20 }}>{title}</div>
            <div style={{ fontSize: 30, color: "#5d687a", marginTop: 28 }}>Printable, playable, PDF-ready puzzles with answer keys.</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
