/** Explicit handoffs only: no provider SDK, shortener, request or automatic sending. */
export function puzzleShareDestinations(playUrl: string) {
  const message = `Solve this word search:\r\n${playUrl}`;
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
    email: `mailto:?subject=${encodeURIComponent("A word search to solve")}&body=${encodeURIComponent(message)}`
  };
}
