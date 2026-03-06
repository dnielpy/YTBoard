"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export const useThumbnailPreview = () => {
  const t = useTranslations("youtube");

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState(t("thumbnail.defaults.title"));
  const [channelName, setChannelName] = useState(
    t("thumbnail.defaults.channel"),
  );
  const [views, setViews] = useState(t("thumbnail.defaults.views"));
  const [timeAgo, setTimeAgo] = useState(t("thumbnail.defaults.timeAgo"));
  const [duration, setDuration] = useState(t("thumbnail.defaults.duration"));

  return {
    thumbnailUrl,
    setThumbnailUrl,
    videoTitle,
    setVideoTitle,
    channelName,
    setChannelName,
    views,
    setViews,
    timeAgo,
    setTimeAgo,
    duration,
    setDuration,
  };
};

export type ThumbnailPreviewState = ReturnType<typeof useThumbnailPreview>;
