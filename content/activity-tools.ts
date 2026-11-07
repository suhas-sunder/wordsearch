/** Selected task links, not a sitewide network directory. Verified November 6, 2026. */
export interface ActivityToolLink {
  id: "timer" | "morse" | "coloring";
  name: string;
  href: string;
  task: string;
  description: string;
}

export const activityTools: ActivityToolLink[] = [
  { id: "timer", name: "iLoveTimers", href: "https://www.ilovetimers.com/classroom-timer/", task: "Time an activity", description: "Set a visible classroom countdown for a puzzle station or a short break." },
  { id: "morse", name: "MorseWords", href: "https://www.morsewords.com/morse-code-printable-worksheets", task: "Try a code worksheet", description: "Prepare a separate Morse code practice sheet with your own words and optional answers." },
  { id: "coloring", name: "I Love Coloring Page", href: "https://www.ilovecoloringpage.com/", task: "Choose a coloring activity", description: "Browse printable coloring pages for another paper activity alongside a word search." }
];

const classroomPaths = new Set([
  "/word-searches-for-teachers", "/word-search-worksheets", "/homeschool-word-searches",
  "/collections/classroom-word-search-worksheets", "/pack-builder"
]);
const paperActivityPaths = new Set(["/free-printable-word-searches", "/word-searches-for-kids"]);

export function activityToolContext(path: string): { heading: string; introduction: string; links: ActivityToolLink[] } | null {
  if (classroomPaths.has(path)) return {
    heading: "More tools for classroom activities",
    introduction: "Optional tools from the same creator for timing an activity or preparing a different handout.",
    links: activityTools
  };
  if (paperActivityPaths.has(path)) return {
    heading: "Plan another paper activity",
    introduction: "Pair a word search with a timed activity, a code worksheet, or a coloring page. These links open other sites from the same creator.",
    links: activityTools
  };
  return null;
}
