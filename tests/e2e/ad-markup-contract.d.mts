export interface AdMarkupInput {
  slots: Array<Record<string, string>>;
  units: Array<Record<string, string>>;
  placeholders: Array<Record<string, string>>;
  enabled?: boolean;
}
export const approvedAdSlots: Readonly<Record<string, string>>;
export function indexedAdMarkupIssues(input: AdMarkupInput): string[];
