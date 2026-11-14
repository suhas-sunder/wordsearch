import type { ContentRecord } from "@/content/model";

export function editorialAdTemplate(
  record: Pick<ContentRecord, "publicationStatus" | "indexable"> | undefined,
  template: "category" | "collection" | "guide"
) {
  return record?.publicationStatus === "published" && record.indexable ? template : "draft";
}
