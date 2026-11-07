"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";
const key = "ilws-theme";
const choices: Theme[] = ["system", "light", "dark"];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const preference = useRef<Theme>("system");
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function sync() {
      let choice: Theme = preference.current;
      try {
        const saved = localStorage.getItem(key);
        choice = saved === "light" || saved === "dark" ? saved : "system";
      } catch { /* Storage can be unavailable in private or restricted contexts. */ }
      setTheme(choice);
      preference.current = choice;
      document.documentElement.dataset.theme = choice === "system" ? (media.matches ? "dark" : "light") : choice;
    }
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("storage", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function change() {
    const next = choices[(choices.indexOf(theme) + 1) % choices.length];
    preference.current = next;
    setTheme(next);
    document.documentElement.dataset.theme = next === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : next;
    try { if (next === "system") localStorage.removeItem(key); else localStorage.setItem(key, next); } catch { /* The choice still works for this page. */ }
  }
  const Icon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;
  const next = choices[(choices.indexOf(theme) + 1) % choices.length];
  return <button className="theme-toggle" type="button" onClick={change} aria-label={`Theme: ${theme}. Switch to ${next} mode`} title={`Theme: ${theme}. Switch to ${next} mode`}><Icon size={18} aria-hidden="true" /></button>;
}
