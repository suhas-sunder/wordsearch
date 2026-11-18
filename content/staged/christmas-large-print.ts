/** Editorial format asset only. Never register a new route or infer publication approval. */
export interface ChristmasLargePrintArtifact {
  id: "X03";
  source: {
    id: "X02";
    file: "content/staged/christmas.ts";
    contentCommit: "bd6f2d12098968c094cdd05eba122fe5b59b2c46";
    canonicalPath: "/word-searches/holidays/easy-christmas-word-search";
    requestSha256: string;
    gridSha256: string;
    answerSha256: string;
  };
  layoutProfile: "large-print";
  paperSizes: readonly ["letter", "a4"];
  minimumGridPt: 16;
  minimumWordBankPt: 18;
  editorialStatus: "unreviewed";
  runtimeImportAllowed: false;
  createsIndexableVariant: false;
  newIndexableUrlAllowance: 0;
  publicationAuthorized: false;
}

export const christmasLargePrintArtifact: ChristmasLargePrintArtifact = {
  id: "X03",
  source: {
    id: "X02",
    file: "content/staged/christmas.ts",
    contentCommit: "bd6f2d12098968c094cdd05eba122fe5b59b2c46",
    canonicalPath: "/word-searches/holidays/easy-christmas-word-search",
    requestSha256: "08238a47e6b3849bfbe13f3a17dbf5bd9aef14a7e4bb2a7b5400854b2c24337c",
    gridSha256: "4c462fa3f24955d8daa78503adb0ee5db81b6e0b3d1107e2abbd2bb5ed3e3fcb",
    answerSha256: "e3e6002c4391edbe5059731ee017eefabc19b1eb356c9c1b7632b0ecdfbd0ba9"
  },
  layoutProfile: "large-print",
  paperSizes: ["letter", "a4"],
  minimumGridPt: 16,
  minimumWordBankPt: 18,
  editorialStatus: "unreviewed",
  runtimeImportAllowed: false,
  createsIndexableVariant: false,
  newIndexableUrlAllowance: 0,
  publicationAuthorized: false
};
