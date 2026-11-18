import type { ComponentProps } from "react";

// Ad-free destinations need a new document: React unmounting cannot dispose of
// provider-owned Auto Ads outside the application tree. Keep native navigation,
// modified clicks, downloads and no-JavaScript behavior without client handlers.
export function DocumentLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
