import Image from "next/image";

/** Decorative brand artwork; the containing element supplies its accessible name. */
export function BrandIdentity() {
  return (
    <>
      <Image className="brand-mark" src="/brand-icon.webp" width={34} height={34} alt="" aria-hidden="true" />
      <span className="brand-wordmark" aria-hidden="true">
        <span>i</span><span className="brand-heart">💚</span><span>WordSearch</span>
      </span>
    </>
  );
}
