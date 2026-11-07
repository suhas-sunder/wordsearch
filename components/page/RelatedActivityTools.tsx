import { Clock3, ExternalLink, Palette, Radio } from "lucide-react";
import { activityToolContext } from "@/content/activity-tools";
import styles from "./RelatedActivityTools.module.css";

const icons = { timer: Clock3, morse: Radio, coloring: Palette };

/** Server-rendered optional links; no embeds, widgets, tracking or hydration. */
export function RelatedActivityTools({ path }: { path: string }) {
  const context = activityToolContext(path);
  if (!context) return null;
  return (
    <section className={`content-section site-shell ${styles.section}`} data-related-activities aria-labelledby="related-activities-heading">
      <div className="section-heading">
        <h2 id="related-activities-heading">{context.heading}</h2>
        <p>{context.introduction}</p>
      </div>
      <ul className={styles.list}>
        {context.links.map((tool) => {
          const Icon = icons[tool.id];
          return <li key={tool.id}>
            <a href={tool.href} rel="external" className={styles.link}>
              <Icon size={22} aria-hidden="true" />
              <span className={styles.copy}>
                <strong>{tool.task}</strong>
                <span>{tool.description}</span>
                <span className={styles.site}>{tool.name}<ExternalLink size={14} aria-hidden="true" /></span>
              </span>
            </a>
          </li>;
        })}
      </ul>
    </section>
  );
}
