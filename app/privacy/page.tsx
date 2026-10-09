import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Privacy Policy | I Love Word Search", "Learn how I Love Word Search handles browser preferences, shared puzzle links, PDF generation, QR codes, external links, and contact.", "/privacy");

export default function PrivacyPage() {
  return <TrustPage eyebrow="Current site behavior" h1="Privacy Policy" path="/privacy" lede="I Love Word Search does not require an account to create, solve, print, download, or share a puzzle." sections={[
    { heading: "Browser storage", paragraphs: ["The site uses local browser storage for builder state and puzzle display or output preferences. That information remains in the browser unless you clear it. The current application does not install analytics. Advertising remains disabled unless the separately reviewed AdSense activation setting is enabled."] },
    { heading: "Shared puzzle links", paragraphs: ["A share link can encode the puzzle definition needed to reproduce a custom puzzle. It does not include which words a solver has found, reveal progress, or completion progress. Avoid entering private or sensitive information in a word list that you plan to share."] },
    { heading: "PDF and QR behavior", paragraphs: ["PDF files are created by the site’s server endpoint from the submitted puzzle definition. QR images are generated locally in the browser from the share URL; the site does not use an external QR service."] },
    { heading: "Advertising and external links", paragraphs: ["When advertising is disabled, labelled ad areas are inactive layout placeholders. If the reviewed advertising setting is enabled, eligible content pages load Google AdSense, while search, utility, print, PDF, play, answer-key, trust, and legal pages remain ad-free. Google may use cookies or similar technologies and process device or interaction data to deliver and measure advertising under Google’s own privacy terms. A Google-certified consent management platform must be configured before personalized ads are enabled where Google requires one. Links to other external sites follow those sites’ own privacy practices."] },
    { heading: "Questions", paragraphs: [<>Use the <Link href="/contact">Contact page</Link> for a privacy question. The site currently directs contact through the owner’s public portfolio or LinkedIn profile rather than collecting a message through an on-site form.</>] }
  ]} />;
}
