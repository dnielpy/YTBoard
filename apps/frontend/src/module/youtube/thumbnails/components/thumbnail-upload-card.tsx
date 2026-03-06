"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, ImageIcon } from "lucide-react";
import { handleFileSelect } from "../utils/file-helper";

interface ThumbnailUploadCardProps {
  thumbnailUrl: string | null;
  onThumbnailSelect: (url: string) => void;
}

export function ThumbnailUploadCard({
  thumbnailUrl,
  onThumbnailSelect,
}: ThumbnailUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("youtube");

  return (
    <Card className="border-border bg-card lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-foreground">
          {t("thumbnail.upload.title")}
        </CardTitle>
        <CardDescription>{t("thumbnail.upload.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/50 px-4 py-10 transition-colors hover:border-primary/50 hover:bg-secondary"
        >
          {thumbnailUrl ? (
            <div className="relative w-full overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={t("thumbnail.upload.thumbnailAlt") ?? "thumbnail"}
                className="aspect-video w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity hover:opacity-100">
                <Upload className="h-8 w-8 text-foreground" />
              </div>
              <Badge className="absolute bottom-1.5 right-1.5 bg-[#0f0f0f]/90 px-1.5 py-0.5 text-[10px] font-medium text-[#f1f1f1] hover:bg-[#0f0f0f]/90">
                {t("thumbnail.upload.update")}
              </Badge>
            </div>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <ImageIcon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {t("thumbnail.upload.selectImage")}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("thumbnail.upload.recommendedSize")}
                </p>
              </div>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, onThumbnailSelect)}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
