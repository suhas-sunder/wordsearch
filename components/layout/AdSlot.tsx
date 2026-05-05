export function AdSlot({ label = "Reserved ad space" }: { label?: string }) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <span>{label}</span>
    </aside>
  );
}
