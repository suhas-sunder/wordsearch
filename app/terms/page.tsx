import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Terms of Use | I Love Word Search", "Terms for using, creating, downloading, printing, and sharing puzzles with I Love Word Search.", "/terms");

export default function TermsPage() {
  return <TrustPage eyebrow="Using the site" h1="Terms of Use" path="/terms" lede="The site’s tools and published resources are intended for reasonable personal, classroom, homeschool, and casual activity use." sections={[
    { heading: "Downloads and printing", paragraphs: ["You may download and print puzzles for personal and classroom activities. Site design, software, branding, and original editorial content remain the intellectual property of their respective owner. Third-party material remains subject to its own rights."] },
    { heading: "User-entered content", paragraphs: ["You are responsible for words, clues, titles, and other content you enter or share. The generator cannot guarantee that every user-entered word list, or every accidental filler sequence, is suitable for every audience. Do not use the service to create or distribute unlawful, hateful, abusive, infringing, or dangerous material."] },
    { heading: "Fair use of the service", paragraphs: ["Do not interfere with the site, attempt unauthorized access, overload its services, misrepresent its output, or use it to violate another person’s rights."] },
    { heading: "Availability and corrections", paragraphs: [<>The service may change, experience interruptions, or contain errors. Puzzles and supporting information may be corrected when an issue is found. Use the <Link href="/contact">Contact page</Link> to report a problem.</>] }
  ]} />;
}
