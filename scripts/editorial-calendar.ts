import { auditEditorialCalendar, createZeroPublicationLedger, prepareEditorialSelection } from "@/lib/content/editorial-calendar";
import { editorialCalendarPolicy, editorialReviewWindows } from "@/content/staged/editorial-calendar-2027";
import { allEditorialPuzzleCandidates, editorialAssetReferences } from "@/content/staged/editorial-assets";

const flags = new Map(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--(slot|assets|disposition|reason|carry-to)=(.*)$/);
  if (!match) throw new Error("Use --slot=N --assets=ID --disposition=hold|propose-for-review|merge-into-existing|carry-forward|cancel --reason=text [--carry-to=N], or no arguments for all zero-publication windows.");
  return [match[1], match[2]];
}));
if (flags.size && !flags.has("slot")) throw new Error("Choose --slot=N when supplying review-selection arguments.");
const issues = auditEditorialCalendar();
if (issues.length) throw new Error(issues.join("\n"));
const ledger = flags.has("slot") ? [prepareEditorialSelection({ slot: Number(flags.get("slot")), ...(flags.has("assets") ? { assetIds: flags.get("assets")!.split(",") } : {}), ...(flags.has("disposition") ? { disposition: flags.get("disposition") } : {}), ...(flags.has("reason") ? { reason: flags.get("reason") } : {}), ...(flags.has("carry-to") ? { carryToSlot: Number(flags.get("carry-to")) } : {}) })] : createZeroPublicationLedger();
console.log(JSON.stringify({ policy: editorialCalendarPolicy, inventory: { puzzleCandidates: allEditorialPuzzleCandidates.length, utilitySelections: editorialAssetReferences.filter(({ kind }) => kind === "utility-selection").length, preservedOwnerEnhancements: editorialAssetReferences.filter(({ kind }) => kind === "existing-draft-enhancement").length }, windows: editorialReviewWindows, assets: editorialAssetReferences, issues, ledger, publicationAuthorized: false }, null, 2));
