import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Accessibility | I Love Word Search", "Read about keyboard solving, visible focus, contrast, text options, responsive controls, and accessible puzzle output at I Love Word Search.", "/accessibility");

export default function AccessibilityPage() {
  return <TrustPage eyebrow="Inclusive puzzle use" h1="Accessibility" path="/accessibility" lede="The site is designed to support different input methods, readable puzzle presentation, and clean printable output." sections={[
    { heading: "Current interaction support", items: ["Keyboard puzzle solving and a tap-endpoint selection mode", "Pointer, mouse, touch, and pen input", "Visible focus states and responsive dialogs", "Large-letter and bold-letter options", "High-contrast selection styling", "Progress announcements for assistive technology", "Found and revealed states that do not rely on color alone", "Print-friendly puzzle and answer-key output"] },
    { heading: "Ongoing work", paragraphs: ["These features do not represent a formal WCAG certification. Accessibility improvements are an ongoing part of product development and review." ] },
    { heading: "Report a problem", paragraphs: [<>If a control, puzzle, dialog, print view, or PDF is difficult to use, please describe the issue through the <Link href="/contact">Contact page</Link>. Include your device, browser, input method, and the affected page when possible.</>] }
  ]} />;
}
