import {
  BookOpen,
  BookText,
  Calculator,
  CalendarDays,
  Church,
  FlaskConical,
  Flower2,
  HeartPulse,
  Landmark,
  Luggage,
  Map,
  Music2,
  Palette,
  PawPrint,
  School,
  Trophy,
  Utensils,
  type LucideIcon
} from "lucide-react";

const iconByCategorySlug: Record<string, LucideIcon> = {
  "animals-word-searches": PawPrint,
  "holiday-word-searches": CalendarDays,
  "science-word-searches": FlaskConical,
  "math-word-searches": Calculator,
  "language-arts-word-searches": BookText,
  "geography-word-searches": Map,
  "history-word-searches": Landmark,
  "food-and-drink-word-searches": Utensils,
  "sports-word-searches": Trophy,
  "travel-word-searches": Luggage,
  "health-and-wellness-word-searches": HeartPulse,
  "music-word-searches": Music2,
  "books-and-reading-word-searches": BookOpen,
  "art-word-searches": Palette,
  "nature-and-weather-word-searches": Flower2,
  "faith-word-searches": Church,
  "classroom-and-values-word-searches": School
};

const categorySlugByLabel: Record<string, string> = {
  animals: "animals-word-searches",
  holiday: "holiday-word-searches",
  holidays: "holiday-word-searches",
  science: "science-word-searches",
  math: "math-word-searches",
  "language arts": "language-arts-word-searches",
  geography: "geography-word-searches",
  history: "history-word-searches",
  "food and drink": "food-and-drink-word-searches",
  sports: "sports-word-searches",
  travel: "travel-word-searches",
  "health and wellness": "health-and-wellness-word-searches",
  wellness: "health-and-wellness-word-searches",
  music: "music-word-searches",
  "books and reading": "books-and-reading-word-searches",
  art: "art-word-searches",
  "nature and weather": "nature-and-weather-word-searches",
  faith: "faith-word-searches",
  "classroom and values": "classroom-and-values-word-searches"
};

function categorySlugFor(slug?: string, label?: string) {
  const normalizedSlug = slug?.trim().toLowerCase();
  if (normalizedSlug && Object.hasOwn(iconByCategorySlug, normalizedSlug)) return normalizedSlug;
  const normalizedLabel = label?.trim().toLowerCase();
  if (!normalizedLabel || !Object.hasOwn(categorySlugByLabel, normalizedLabel)) return undefined;
  const categorySlug = categorySlugByLabel[normalizedLabel];
  return Object.hasOwn(iconByCategorySlug, categorySlug) ? categorySlug : undefined;
}

export function CategoryIcon({ slug, label, className = "" }: { slug?: string; label?: string; className?: string }) {
  const categorySlug = categorySlugFor(slug, label);
  const Icon = categorySlug ? iconByCategorySlug[categorySlug] : undefined;
  if (!Icon || !categorySlug) return null;

  return <Icon className={`category-icon ${className}`.trim()} size={18} strokeWidth={1.8} aria-hidden="true" focusable="false" data-category-icon={categorySlug} />;
}
