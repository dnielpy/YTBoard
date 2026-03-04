"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "../../lib/utils";

type Props = {
  className?: string;
};

export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
