"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/system/theme-provider";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="text-sm font-medium"
      aria-label="Switch language"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-2 w-2" />
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
