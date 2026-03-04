import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/app/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/system/theme-provider";

export function Providers({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale}>
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
