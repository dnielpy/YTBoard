import { BarChart3, Users, TrendingUp, Video, Eye, Zap } from "lucide-react";

import type { Panel } from "../types/login.types";

export const PANELS: Panel[] = ["welcome", "login", "register"];

export const PHASES = ["logo", "tagline", "cta"] as const;

export const FEATURES = [
  {
    icon: <BarChart3 className="h-5 w-5" />,
    titleKey: "features.analytics.title",
    descriptionKey: "features.analytics.description",
  },
  {
    icon: <Users className="h-5 w-5" />,
    titleKey: "features.audience.title",
    descriptionKey: "features.audience.description",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    titleKey: "features.growth.title",
    descriptionKey: "features.growth.description",
  },
  {
    icon: <Video className="h-5 w-5" />,
    titleKey: "features.management.title",
    descriptionKey: "features.management.description",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    titleKey: "features.live.title",
    descriptionKey: "features.live.description",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    titleKey: "features.actions.title",
    descriptionKey: "features.actions.description",
  },
];
