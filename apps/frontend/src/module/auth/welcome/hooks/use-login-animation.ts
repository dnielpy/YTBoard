"use client";

import { useState, useEffect, useCallback } from "react";

import type { Phase, Panel } from "../types/login.types";
import { PANELS, PHASES } from "../utils/login.constants";

export const useLoginAnimation = () => {
  const [phase, setPhase] = useState<Phase>("logo");
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [panel, setPanel] = useState<Panel>("welcome");

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      if (prev === "logo") return "tagline";
      if (prev === "tagline") {
        setTimeout(() => setFeaturesVisible(true), 200);
        return "features";
      }
      return "cta";
    });
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => advancePhase(), 1500),
      setTimeout(() => advancePhase(), 3200),
      setTimeout(() => setPhase("cta"), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [advancePhase]);

  const phaseIndex = PHASES.indexOf(phase);
  const slideIndex = PANELS.indexOf(panel);

  return {
    phase,
    phaseIndex,
    featuresVisible,
    panel,
    setPanel,
    slideIndex,
  };
};
