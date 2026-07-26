import { notFound } from "next/navigation";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Custom Word Search", "Noindex custom share surface.");

export default function CustomSharePage() {
  notFound();
}
