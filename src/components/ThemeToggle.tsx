"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as "dark" | "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("admin-theme", next);
    } catch {
      // localStorage unavailable — theme just won't persist across reloads
    }
  }

  return (
    <label className="flex flex-col gap-1 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
      Theme
      <select
        value={theme}
        onChange={handleChange}
        className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-ink dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
      >
        <option value="dark">Dark</option>
        <option value="light">White</option>
      </select>
    </label>
  );
}
