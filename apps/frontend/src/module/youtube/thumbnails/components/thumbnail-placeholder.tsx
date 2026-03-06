import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface ThumbnailPlaceholderProps {
  className?: string;
}

export function ThumbnailPlaceholder({ className }: ThumbnailPlaceholderProps) {
  const t = useTranslations("youtube");

  return (
    <div
      className={cn("flex items-center justify-center bg-secondary", className)}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <ImageIcon className="h-8 w-8" />
        <span className="text-xs">
          {t("thumbnail.placeholder.uploadPrompt")}
        </span>
      </div>
    </div>
  );
}
