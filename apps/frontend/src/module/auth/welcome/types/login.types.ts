import type { ReactNode } from "react";

export type Phase = "logo" | "tagline" | "cta";

export type Panel = "welcome" | "login" | "register";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
  isVisible: boolean;
}
