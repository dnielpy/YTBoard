"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ThumbnailMetadataFormProps {
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
  onTitleChange: (value: string) => void;
  onChannelChange: (value: string) => void;
  onViewsChange: (value: string) => void;
  onTimeAgoChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}

export const ThumbnailMetadataForm = ({
  title,
  channel,
  views,
  timeAgo,
  duration,
  onTitleChange,
  onChannelChange,
  onViewsChange,
  onTimeAgoChange,
  onDurationChange,
}: ThumbnailMetadataFormProps) => {
  const t = useTranslations("youtube");

  return (
    <Card className="border-border bg-card lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-foreground">
          {t("thumbnail.metadata.title")}
        </CardTitle>
        <CardDescription>{t("thumbnail.metadata.description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="prev-title" className="text-foreground">
            {t("thumbnail.metadata.fields.videoTitle")}
          </Label>
          <Input
            id="prev-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="border-border bg-secondary/50 text-foreground"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="prev-channel" className="text-foreground">
            {t("thumbnail.metadata.fields.channelName")}
          </Label>
          <Input
            id="prev-channel"
            value={channel}
            onChange={(e) => onChannelChange(e.target.value)}
            className="border-border bg-secondary/50 text-foreground"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="prev-views" className="text-foreground">
            {t("thumbnail.metadata.fields.views")}
          </Label>
          <Input
            id="prev-views"
            value={views}
            onChange={(e) => onViewsChange(e.target.value)}
            className="border-border bg-secondary/50 text-foreground"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="prev-time" className="text-foreground">
            {t("thumbnail.metadata.fields.timeAgo")}
          </Label>
          <Input
            id="prev-time"
            value={timeAgo}
            onChange={(e) => onTimeAgoChange(e.target.value)}
            className="border-border bg-secondary/50 text-foreground"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="prev-duration" className="text-foreground">
            {t("thumbnail.metadata.fields.duration")}
          </Label>
          <Input
            id="prev-duration"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            className="border-border bg-secondary/50 text-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};
