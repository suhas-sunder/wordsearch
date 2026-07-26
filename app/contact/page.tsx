import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Contact I Love Word Search | Feedback and Corrections", "Contact I Love Word Search about broken puzzles, word errors, printing, accessibility, privacy, duplicate content, or general feedback.", "/contact");

export default function ContactPage() {
  return <TrustPage eyebrow="Feedback and corrections" h1="Contact I Love Word Search" path="/contact" lede="Report a problem or share feedback through Suhas Sunder’s established public profiles." sections={[
    { heading: "What to report", items: ["Broken puzzles or incorrect words", "Print or PDF problems", "Accessibility issues", "Duplicate content or inappropriate topics", "Privacy questions and general feedback"] },
    { heading: "How to get in touch", paragraphs: [<>This site does not currently operate an on-site message form or require an account. Contact Suhas through his <a href="https://www.suhassunder.com/" target="_blank" rel="noopener noreferrer">public portfolio</a> or send a message through <a href="https://www.linkedin.com/in/s-sunder/" target="_blank" rel="noopener noreferrer">LinkedIn</a>. Include the page URL, what you expected, and what happened so the issue can be reproduced.</>] }
  ]} />;
}
