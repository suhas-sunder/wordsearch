/** H08 utility/packet variants only; combined subjects are not new SEO candidates. */
export const challengeSourceWordHashes = {
  "H01-P": "891ff8c1c79bb5674f432143bfa2af68de7c171fa983401f25d0e89239977772",
  "H02-C": "4b2a91584e52bf332e251eed2def5e51325cdb2f8c14c635f71c19c33b2fefb0",
  "H03-O": "f3f22e3a92e6b94dafb9f1fac6653145da23d6b6cb27aeadc221523938a667a4",
  "H04-P": "439a1c45bcd2d39fc21c1715ee8bea316748c68cd622c2582594471d1e2975dd",
  "H05-M": "eaca8bbc84c38aa649e22b6316dbcea83541f793bd8b3c3d97d2791d29ced656",
  "H06-L": "e8171aca7e2053d36ec734acaa5a7b32d45188437024f4e19e16d60c69cf33e3",
  "H07-A": "ad53c385c4f8f252a3652c7a88af191a4ef1da408ab02077a10dd49957a94b49",
  "H07-B": "b22359b539b4c1e25e15565030d9fc1ec17f4bb435f6a5dfeff37f0b597f2dc5",
  "H05-R": "bb41571104ac21cae121dce7d2c96fb49c2865222599124f2ecb812a363ab731",
  "H06-W": "64a4a379e5ad2cfcf510ae3543f817962d67f53de58eb1657d4f032759e13022"
} as const;

export const thirtyTargetChallenge = {
  id: "H08",
  packId: "thirty-target-review",
  title: "30 Target Challenge",
  purpose: "Five mixed-subject utility sheets with thirty targets each. Each combines fifteen unchanged entries from two existing twenty-target banks. The larger target count increases the search workload within the same grid bounds; it is not an expert certification or measured solve-time claim.",
  rows: 20,
  columns: 20,
  targetsPerSheet: 30,
  entriesPerSource: 15,
  sheets: [
    { id: "h08-language", title: "Language Structure Challenge", sourceIds: ["H06-L", "H06-W"] },
    { id: "h08-maps-aircraft", title: "Maps and Aircraft Challenge", sourceIds: ["H02-C", "H07-A"] },
    { id: "h08-print-building", title: "Print and Building Challenge", sourceIds: ["H04-P", "H07-B"] },
    { id: "h08-natural-structures", title: "Natural Structures Challenge", sourceIds: ["H01-P", "H05-M"] },
    { id: "h08-ocean-energy", title: "Ocean and Energy Challenge", sourceIds: ["H03-O", "H05-R"] }
  ],
  reviewNote: "Combined headings identify two vocabulary sources, not a new scientific classification, curriculum or factual relationship. Original source caveats and human entry-by-entry review still apply. Inspect all vocabulary and print output before choosing a worksheet.",
  runtimeImportAllowed: false,
  editorialApproval: false,
  publicationAuthorized: false,
  newIndexableUrlAllowance: 0
} as const;
