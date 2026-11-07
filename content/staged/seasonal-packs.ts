/** Source-only compositions. A manifest is not publication or editorial approval. */
export const seasonalDraftPacks = [
  { id: "christmas-variety", name: "Christmas Variety", purpose: "A five-puzzle Christmas mix with one harder challenge.", children: ["published:christmas-word-search", "X01", "X02", "X04", "X15"] },
  { id: "christmas-classroom", name: "Christmas Classroom", purpose: "A classroom selection that substitutes the action-word station for the hard puzzle. Teacher audience review remains required.", children: ["published:christmas-word-search", "X02", "X04", "X15", "X08-A"] },
  { id: "new-year-activities", name: "New Year Activities", purpose: "Existing New Year celebration plus distinct countdown, planning, hosting and cleanup vocabulary. Three companions are reusable year-round activities.", children: ["published:new-year-word-search", "X14-A", "X14-B", "X14-C", "X14-D"] },
  { id: "seasonal-classroom", name: "Seasonal Classroom", purpose: "Five independent classroom activity themes across the year, selected without grade-level certification.", children: ["S27-VAL", "S27-SPR", "S27-EGG", "S27-GRAD", "S27-SCHOOL"] },
  { id: "year-round-activities", name: "Year Round Activities", purpose: "Ten distinct word banks spanning school, crafts, camps and seasonal preparation, kept as one source-only packet instead of format pages.", children: ["S27-VAL", "S27-SPR", "S27-EGG", "S27-MOM", "S27-DAD", "S27-GRAD", "S27-CAMP", "S27-SCHOOL", "S27-HARV", "S27-HALLOW"] }
] as const;
