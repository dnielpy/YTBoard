import { useTranslations } from "next-intl";

import { YoutubeIcon } from "./youtube-icon";

export const BrandLockup = ({ compact = false }: { compact?: boolean }) => {
  const t = useTranslations("auth.login");

  return (
    <div
      className={`flex items-center gap-3 ${compact ? "text-sm" : "text-base"}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <YoutubeIcon className="h-6 w-auto" />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-xl font-semibold leading-tight text-foreground">
          YTBoard
        </span>
        {!compact ? (
          <span className="text-xs text-muted-foreground">
            {t("brand.subtitle")}
          </span>
        ) : null}
      </div>
    </div>
  );
};
