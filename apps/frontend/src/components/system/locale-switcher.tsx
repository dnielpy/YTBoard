import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/app/i18n/navigation";
import { useTransition } from "react";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, ChevronsUpDown, Check, Loader2, Globe } from "lucide-react";
import { routing } from "@/app/i18n/routing";

export const LocaleSwitcher = () => {
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
          className="text-sm font-medium"
          aria-label="Switch language"
        >
          <Globe />
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
};
