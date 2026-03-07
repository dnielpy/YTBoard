import { useTranslations } from "next-intl";
import { CheckCircle2, ArrowRight } from "lucide-react";

import { BrandLockup } from "./brand-lockup";
import { YoutubeIcon } from "./youtube-icon";

export const OnboardingPanel = () => {
  const t = useTranslations("auth.login.onboarding");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-10">
      <button
        type="button"
        className="group relative flex w-full cursor-pointer flex-col items-center gap-5 rounded-2xl border border-border/60 bg-card/50 p-8 backdrop-blur transition-all duration-500 hover:border-[#FF0000]/30 hover:bg-card/70 hover:shadow-[0_0_60px_-10px_rgba(255,0,0,0.15)]"
        onClick={() => {}}
      >
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FF0000]/10 ring-1 ring-[#FF0000]/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#FF0000]/15 group-hover:ring-[#FF0000]/40 group-hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.3)]">
          <YoutubeIcon className="h-10 w-auto transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,_oklch(0.63_0.25_29/0.06),_transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative flex items-center gap-2 rounded-full bg-[#FF0000] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] shadow-[0_0_25px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 group-hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.5)]">
          {t("connect")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </button>
    </div>
  );
};
