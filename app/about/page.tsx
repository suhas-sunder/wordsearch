import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";
import { aboutProfileJsonLd } from "@/lib/seo/structured-data";

export const metadata = pageMetadata(
  "About I Love Word Search | Creator and Site Purpose",
  "Learn about I Love Word Search, its creator Suhas Sunder, and the standards used to build reliable online, printable, and downloadable word search puzzles.",
  "/about"
);

export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="Creator and site purpose"
      h1="About I Love Word Search"
      path="/about"
      lede="I Love Word Search is a free collection of printable and online word search puzzles, along with tools for creating, printing, downloading, and sharing custom puzzles."
      jsonLd={aboutProfileJsonLd()}
      sections={[
        {
          heading: "A straightforward puzzle resource",
          paragraphs: ["The site is designed to make it straightforward for families, teachers, students, adults, and puzzle fans to find or create a suitable activity without unnecessary sign-ups or confusing download steps."]
        },
        {
          heading: "Created and maintained by Suhas Sunder",
          paragraphs: [
            "I Love Word Search is created and maintained by Suhas Sunder, a software developer who builds full-stack web applications and focused browser tools. His work includes React, TypeScript, JavaScript, Node.js, APIs, relational data, and responsive interface development.",
            "Suhas holds a bachelor’s degree in engineering and a Master of Engineering in Electrical and Computer Engineering, with management-focused graduate study.",
            <>View Suhas&apos;s <a href="https://www.suhassunder.com/" target="_blank" rel="noopener noreferrer">portfolio</a> or <a href="https://www.linkedin.com/in/s-sunder/" target="_blank" rel="noopener noreferrer">LinkedIn profile</a>.</>
          ]
        },
        {
          heading: "Why he built the site",
          paragraphs: ["Suhas built I Love Word Search to combine a reliable puzzle generator with an organized library of puzzles that can be played online or used as printable activities. His engineering and software background informs the site’s emphasis on deterministic puzzle generation, consistent answer keys, accessible controls, responsive layouts, and accurate print and PDF output."]
        },
        {
          heading: "Editorial responsibility",
          paragraphs: [
            "Suhas is responsible for product development, puzzle-generation systems, user experience, publishing standards, corrections, and accessibility improvements.",
            <>Read <Link href="/how-word-searches-are-made">how our word searches are made</Link> and the <Link href="/editorial-policy">editorial and puzzle standards</Link>, or <Link href="/contact">report a problem</Link>.</>
          ]
        }
      ]}
    />
  );
}
