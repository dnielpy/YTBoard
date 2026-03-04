"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { routing } from "@/app/i18n/routing";
import { ThemeToggle } from "@/components/system/theme-toggle";
import { Languages, ChevronsUpDown, Bell, Check, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocale } from "next-intl";
import { cn } from "../../../lib/utils";

const userEmail = "superadmin@gmail.com";
const userInitial = userEmail.charAt(0).toUpperCase();

function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (targetLocale: string) => {
    if (targetLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: targetLocale });
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 gap-2 px-3 text-sm font-medium"
          aria-label="Switch language"
        >
          <span className="inline-flex items-center gap-1">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">
              {locale === "es" ? "Español" : "English"}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Idioma
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={() => handleSelect(loc)}
            className={cn(
              "flex items-center gap-2",
              loc === locale && "font-semibold",
            )}
          >
            <span className="flex-1">
              {loc === "es" ? "Español" : "English"}
            </span>
            {loc === locale ? (
              isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Appbar() {
  return (
    <header className="flex items-center justify-between gap-4 px-3 py-2 text-sm shadow-sm">
      <div className="font-medium">Inicio</div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <LocaleSwitcher />

        <div className="hidden items-center gap-2 px-4 py-3 sm:flex rounded-md">
          <span className="text-sm  ">{userEmail}</span>
        </div>

        <Avatar className="h-10 w-10  border border-border">
          <AvatarFallback className="bg-white/10">{userInitial}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
