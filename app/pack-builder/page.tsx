import { noindexMetadata } from "@/lib/seo/metadata";
import { ClassroomPackBuilder } from "@/components/pack-builder/ClassroomPackBuilder";
import { RelatedActivityTools } from "@/components/page/RelatedActivityTools";

export const metadata = noindexMetadata("Classroom Word Search Pack Builder", "Create a printable classroom word search pack locally.");

export default function PackBuilderPage() {
  return <main className="site-shell"><ClassroomPackBuilder /><RelatedActivityTools path="/pack-builder" /></main>;
}
