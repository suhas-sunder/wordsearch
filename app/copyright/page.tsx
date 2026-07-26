import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Copyright Information | I Love Word Search",
  "Read the copyright and third-party content guidelines for I Love Word Search puzzles, word lists, generated output, and user submissions.",
  "/copyright"
);

export default function CopyrightPage() {
  return (
    <TrustPage
      eyebrow="Site information · reviewed July 25, 2026"
      h1="Copyright Information"
      lede="This page explains what the site creates, how general vocabulary is handled, and what visitors should check before submitting or distributing their own material."
      path="/copyright"
      sections={[
        {
          heading: "Site-created material",
          paragraphs: [
            <>The site&apos;s original writing, page designs, software, puzzle presentation, illustrations, and curated selection and arrangement of material are protected to the extent provided by applicable law. A common word or factual term is not claimed as exclusive property merely because it appears in a puzzle.</>,
            <>Published editorial puzzles use general-interest vocabulary prepared for I Love Word Search. They deliberately avoid franchise-dependent topics, protected characters, performers, song titles, and copyrighted book or story content unless suitability and rights have been reviewed.</>
          ]
        },
        {
          heading: "Custom word lists and user responsibility",
          paragraphs: [
            <>The <Link href="/word-search-generator">word search generator</Link> accepts text supplied by the visitor. Before entering, sharing, printing, or distributing a list, make sure you have the right to use that material and that its context is appropriate for the intended audience.</>,
            <>Generating a grid does not transfer ownership of third-party material, provide a license, or establish that a submitted list is free of copyright, trademark, privacy, publicity, or other restrictions.</>
          ]
        },
        {
          heading: "Third-party names and references",
          paragraphs: [
            <>A factual reference to a place, historical period, common object, or general field is different from copying protected expression. Avoid reproducing substantial passages, proprietary worksheets, commercial puzzle lists, lyrics, fictional characters, or branded collections without permission.</>,
            <>Third-party names and marks remain the property of their respective owners. Their appearance in visitor-supplied content does not imply sponsorship, affiliation, or endorsement by I Love Word Search.</>
          ]
        },
        {
          heading: "Printing and sharing",
          paragraphs: [
            <>Site-created puzzle pages are intended for reasonable personal, classroom, homeschool, and educational use under the site&apos;s <Link href="/terms">Terms of Use</Link>. Do not resell, republish, scrape, or redistribute the site&apos;s collection as a competing library or remove notices that accompany an output.</>,
            <>A share or QR link reproduces a puzzle definition. The person sharing it remains responsible for the words and title in a custom puzzle.</>
          ]
        },
        {
          heading: "Questions and copyright concerns",
          paragraphs: [
            <>If you believe material on the site infringes your rights, use the <Link href="/contact">contact page</Link>. Identify the protected work, the exact site URL, the material at issue, your relationship to the rights holder, and a reliable way to reply.</>,
            <>Reports are reviewed in context. Content may be corrected, restricted, or removed when appropriate; this page is general site information and is not legal advice.</>
          ]
        }
      ]}
    />
  );
}
