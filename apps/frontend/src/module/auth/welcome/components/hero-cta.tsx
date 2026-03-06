import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { YoutubeIcon } from "./youtube-icon";

export const HeroCTA = ({
  phaseIndex,
  onLogin,
}: {
  phaseIndex: number;
  onLogin: () => void;
}) => {
  const t = useTranslations("auth.login");

  return (
    <div
      className="mt-14 flex flex-col items-center gap-4"
      style={{
        opacity: phaseIndex >= 2 ? 1 : 0,
        transform: phaseIndex >= 2 ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="default"
          className="group relative h-11 cursor-pointer gap-2.5 overflow-hidden rounded-lg bg-[#FF0000] px-6 text-sm font-semibold text-[#FFFFFF] shadow-[0_0_25px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#CC0000] hover:shadow-[0_0_35px_-5px_rgba(255,0,0,0.45)]"
          onClick={onLogin}
        >
          <YoutubeIcon className="h-4 w-auto transition-transform duration-300 group-hover:scale-110" />
          {t("cta.button")}
        </Button>
      </div>
    </div>
  );
};
