import Link from "next/link";
import type { DiscoveryLink } from "@/content/discovery";

export function DiscoveryCards({ items, className = "" }: { items: DiscoveryLink[]; className?: string }) {
  return (
    <div className={`discovery-grid ${className}`.trim()}>
      {items.map((item) => (
        <Link className="discovery-card" key={item.href} href={item.href}>
          {item.meta && <span className="card-meta">{item.meta}</span>}
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          <small>Explore <span aria-hidden="true">→</span></small>
        </Link>
      ))}
    </div>
  );
}
