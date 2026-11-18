/**
 * Source-only review records. Never import this directory from app, components,
 * or a module reachable by them. Public descriptions remain in the existing
 * content models until a separately approved, scope-checked patch changes them.
 */
export interface EditorialSourceReference {
  readonly file: string;
  readonly field: string;
  readonly recordId: string;
  readonly commit: string;
}

export interface EditorialNote {
  readonly id: string;
  readonly subjectId: string;
  readonly source: EditorialSourceReference;
  readonly constraints: readonly {
    readonly kind: "factual" | "safety" | "rights" | "audience" | "quality";
    readonly text: string;
  }[];
  readonly sources?: readonly {
    readonly url: string;
    readonly title: string;
    readonly accessedOn: string;
    readonly supports: string;
  }[];
}

export interface PublicCopyProposal {
  readonly id: string;
  readonly noteIds: readonly string[];
  readonly target: EditorialSourceReference;
  readonly before: string;
  readonly after: string;
  readonly reason: string;
  readonly classification: "A" | "B" | "C" | "D" | "E" | "F";
  /** Exact measured route set, not a predicted or wildcard allowance. */
  readonly affectedPaths: readonly string[];
  readonly scopeEvidence: string;
  /** This model cannot grant publication or independent owner approval. */
  readonly decision: { readonly status: "pending-owner-review" };
}
