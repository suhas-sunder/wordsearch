import Link from "next/link";
import type { DiscoveryLink } from "@/content/discovery";
import { CategoryIcon } from "@/components/page/CategoryIcon";

export function DiscoveryCards({ items, className = "" }: { items: DiscoveryLink[]; className?: string }) {
  return (
    <div className={`discovery-grid ${className}`.trim()}>
      {items.map((item) => (
        <Link className="discovery-card" key={item.href} href={item.href}>
          {item.meta && <span className="card-meta">{item.meta}</span>}
          <strong className={item.categorySlug ? "category-title" : undefined}>
            {item.categorySlug && <CategoryIcon slug={item.categorySlug} />}
            {item.title}
          </strong>
          <span>{item.description}</span>
          <small>Explore <span aria-hidden="true">→</span></small>
        </Link>
      ))}
    </div>
  );
}
