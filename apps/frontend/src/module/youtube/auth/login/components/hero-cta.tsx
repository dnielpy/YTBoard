import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { YoutubeIcon } from "./youtube-icon";

export const HeroCTA = ({
  phaseIndex,
  onLogin,
  onRegister,
}: {
  phaseIndex: number;
  onLogin: () => void;
  onRegister: () => void;
}) => {
  const t = useTranslations("auth.login");

  return (
    <div
      className="mt-14 flex flex-col items-center gap-4"
      style={{
        opacity: phaseIndex >= 3 ? 1 : 0,
        transform: phaseIndex >= 3 ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="group relative h-14 cursor-pointer gap-3 overflow-hidden rounded-xl bg-[#FF0000] px-8 text-base font-semibold text-[#FFFFFF] shadow-[0_0_30px_-5px_rgba(255,0,0,0.3)] transition-all duration-300 hover:bg-[#CC0000] hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.45)]"
          onClick={onLogin}
        >
          <YoutubeIcon className="h-5 w-auto transition-transform duration-300 group-hover:scale-110" />
          {t("cta.button")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onRegister}
          className="h-14 px-6 text-base"
        >
          {t("form.goRegister")}
        </Button>
      </div>
    </div>
  );
};
