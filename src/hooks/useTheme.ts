import { useEffect, useState } from "react";
import type { Theme, UseThemeReturn } from "../types";

export const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;

    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initial = stored ?? (systemDark ? "dark" : "light");

    setTheme(initial);

    if (initial === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    console.log(
      "dark class:",
      document.documentElement.classList.contains("dark"),
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";

      localStorage.setItem("theme", newTheme);

      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newTheme;
    });
  };

  return { theme, toggleTheme };
};
