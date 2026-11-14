import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { issue117CollectionAndGuideCopy, issue117ExpandedContexts, issue117FollowUp, issue117Pilot } from "@/content/review/issue117";
import { topics } from "@/content/topics";
import { searchCatalog } from "@/lib/search/catalog";

describe("issue #117 public editorial corrections", () => {
  test("uses the exact approved pilot values in their public fields", () => {
    const [egypt, hardAngle, , homophones, answerGuide] = issue117Pilot.changes;
    const hardCollection = collections.find((collection) => collection.slug === hardAngle.target.recordId);
    const guide = guides.find((record) => record.slug === answerGuide.target.recordId);
    expect([
      topics.find((topic) => topic.topicSlug === egypt.target.recordId)?.context,
      hardCollection?.angle,
      hardCollection?.selectionGuidance,
      topics.find((topic) => topic.topicSlug === homophones.target.recordId)?.introduction,
      guide?.sections.find((section) => section.heading === "Verify each placed coordinate path")?.body
    ]).toEqual(issue117Pilot.changes.map((change) => change.after));
  });

  test.each([...issue117FollowUp.changes, ...issue117ExpandedContexts.changes])("$recordId exposes the revised context in the topic and search catalog", (change) => {
    const puzzlePath = change.affectedPaths.find((path) => path.startsWith("/word-searches/"));
    expect(puzzlePath).toBeDefined();
    const topic = topics.find((record) => "/word-searches/" + record.slug === puzzlePath);
    const searchItem = searchCatalog.find((item) => item.href === puzzlePath);
    expect(topic?.context).toBe(change.after);
    expect(topic?.description).toBe(change.after);
    expect(searchItem?.description).toBe(change.after);
  });

  test.each(issue117CollectionAndGuideCopy.changes)("$recordId $field uses the recorded visitor copy", (change) => {
    if (change.sourceFile === "content/collections.ts") {
      expect(collections.find((item) => item.slug === change.recordId)?.selectionGuidance).toBe(change.after);
      return;
    }
    const guide = guides.find((item) => item.slug === change.recordId);
    const heading = change.field.match(/^sections\[(.+)\]\.body$/)?.[1];
    expect(heading ? guide?.sections.find((section) => section.heading === heading)?.body : guide?.introduction).toBe(change.after);
  });

  test("preserves the confirmed swimming safety boundary", () => {
    const swimming = topics.find((topic) => topic.slug === "sports/swimming-word-search");
    expect(swimming?.description).toContain("follow your instructor or lifeguard for water-safety guidance");
  });

  test("restores both complete authored puzzle sources to their baseline hashes by reversing only the 17 permitted copy edits", () => {
    // SHA-256 of LF-normalized sources from a057692. All 150 word banks and
    // their authored properties remain protected without requiring Git in CI.
    const normalizedHash = (source: string) => createHash("sha256").update(source).digest("hex");
    const readSource = (file: string) => readFileSync(file, "utf8").replaceAll("\r\n", "\n");
    const originalSource = readSource("content/curated-topics.ts");
    expect(normalizedHash(originalSource)).toBe("8bc91850ed63b871186de579dd93688009b64a28dd784344e4d891a44668af4f");

    const prompt6Source = readSource(issue117FollowUp.sourceFile);
    const allowed = [
      ...issue117Pilot.changes.filter((change) => change.target.file === issue117FollowUp.sourceFile),
      ...issue117FollowUp.changes,
      ...issue117ExpandedContexts.changes
    ];
    expect(allowed).toHaveLength(17);
    const revertedSource = allowed.reduce((source, change) => {
      expect(source.split(change.after)).toHaveLength(2);
      return source.replace(change.after, change.before);
    }, prompt6Source);
    expect(normalizedHash(revertedSource)).toBe("cf320a3880064d996dda1e159339d617fc85def008977c9b660710b085e15b26");
  });
});
