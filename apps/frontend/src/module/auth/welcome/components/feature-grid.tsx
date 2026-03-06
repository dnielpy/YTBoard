import { useTranslations } from "next-intl";

import { FEATURES } from "../utils/login.constants";
import { FeatureCard } from "./feature-card";

export const FeatureGrid = ({
  phaseIndex,
  visible,
}: {
  phaseIndex: number;
  visible: boolean;
}) => {
  const t = useTranslations("auth.login");

  return (
    <div
      className="mt-12 w-full"
      style={{
        opacity: phaseIndex >= 2 ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FeatureCard
            key={feature.titleKey}
            icon={feature.icon}
            title={t(feature.titleKey)}
            description={t(feature.descriptionKey)}
            delay={i * 120}
            isVisible={visible}
          />
        ))}
      </div>
    </div>
  );
};
