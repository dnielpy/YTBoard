"use client";

import { ThumbnailUploadCard } from "./thumbnail-upload-card";
import { ThumbnailMetadataForm } from "./thumbnail-metadata-form";
import { ThumbnailPreview } from "./thumbnail-preview";
import { useTranslations } from "next-intl";
import { useThumbnailPreview } from "../hooks/use-thumbnails";

export const ThumbnailEditor = () => {
  const t = useTranslations("youtube");

  const {
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
  } = useThumbnailPreview();
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ThumbnailUploadCard
          thumbnailUrl={thumbnailUrl}
          onThumbnailSelect={setThumbnailUrl}
        />
        <ThumbnailMetadataForm
          title={videoTitle}
          channel={channelName}
          views={views}
          timeAgo={timeAgo}
          duration={duration}
          onTitleChange={setVideoTitle}
          onChannelChange={setChannelName}
          onViewsChange={setViews}
          onTimeAgoChange={setTimeAgo}
          onDurationChange={setDuration}
        />
      </div>

      <ThumbnailPreview
        thumbnailUrl={thumbnailUrl}
        title={videoTitle}
        channel={channelName}
        views={views}
        timeAgo={timeAgo}
        duration={duration}
        t={t}
      />
    </div>
  );
};
