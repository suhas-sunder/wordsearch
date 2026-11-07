/** Shared UTF-16 input limit, matching native input maxLength and URL search. */
export const searchQueryMaxLength = 160;

export function boundSearchQuery(value: string): string {
  let bounded = value.slice(0, searchQueryMaxLength);
  // A native input or this slice can stop between an astral character's halves.
  const last = bounded.charCodeAt(bounded.length - 1);
  if (last >= 0xd800 && last <= 0xdbff) bounded = bounded.slice(0, -1);
  let result = "";
  for (const character of bounded) {
    const code = character.codePointAt(0)!;
    // Keep programmatically supplied malformed UTF-16 safe for encodeURIComponent.
    result += code >= 0xd800 && code <= 0xdfff ? "\ufffd" : character;
  }
  return result;
}
