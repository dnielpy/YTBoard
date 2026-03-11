"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export const MaitenancePage = () => {
  const t = useTranslations("maintenance");

  return (
    <div className="py-60">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 ">
          <AlertTriangle className="size-7 text-primary" />
        </div>
      </div>
      <div className="flex flex-col items-center text-center py-3">
        <h1 className="text-2xl font-semibold text-foreground dark:text-white">
          {t("title")}
        </h1>
        <p className="text-md text-muted-foreground">{t("description")}</p>
      </div>
      <div className="flex items-center justify-center text-center gap-3">
        <Button
          variant="default"
          className="text-white dark:text-white"
          asChild
        >
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>
    </div>
  );
};
