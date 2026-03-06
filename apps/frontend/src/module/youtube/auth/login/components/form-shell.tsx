import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BrandLockup } from "./brand-lockup";

export const FormShell = ({
  title,
  subtitle,
  children,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: ReactNode;
}) => {
  return (
    <Card className="relative w-full max-w-xl overflow-hidden border-border/80 bg-card/70 backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_oklch(0.63_0.25_29/0.12),_transparent_55%)]" />
      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <BrandLockup compact />
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="mt-1 text-base text-muted-foreground">
                {subtitle}
              </CardDescription>
            </div>
          </div>
          {onBack ? (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="relative flex flex-col gap-4 pb-8">
        {children}
      </CardContent>
    </Card>
  );
};
