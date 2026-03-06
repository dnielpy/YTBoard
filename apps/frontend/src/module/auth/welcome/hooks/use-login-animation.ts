"use client";

import { useState, useEffect } from "react";

import type { Phase, Panel } from "../types/login.types";
import { PANELS, PHASES } from "../utils/login.constants";

export const useLoginAnimation = () => {
  const [phase, setPhase] = useState<Phase>("logo");
  const [panel, setPanel] = useState<Panel>("welcome");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("tagline"), 1800),
      setTimeout(() => setPhase("cta"), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const phaseIndex = PHASES.indexOf(phase);
  const slideIndex = PANELS.indexOf(panel);

  return {
    phase,
    phaseIndex,
    panel,
    setPanel,
    slideIndex,
  };
};
