"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { DesktopPreview } from "./devices-preview/desktop-preview";
import { MobilePreview } from "./devices-preview/mobile-desktop";
import { TabletPreview } from "./devices-preview/tablet-preview";

interface ThumbnailPreviewProps {
  thumbnailUrl: string | null;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
  t: (key: string) => string;
}

export const ThumbnailPreview = ({
  thumbnailUrl,
  title,
  channel,
  views,
  timeAgo,
  duration,
  t,
}: ThumbnailPreviewProps) => {
  return (
    <div className="border-border bg-card rounded-lg border">
      <div className="p-6 pb-0">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-foreground">
            {t("thumbnail.preview.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("thumbnail.preview.subtitle")}
          </p>
        </div>
      </div>
      <div className="p-6 pt-4">
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="desktop"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Monitor className="h-4 w-4" />
              {t("thumbnail.preview.tabs.desktop")}
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Smartphone className="h-4 w-4" />
              {t("thumbnail.preview.tabs.mobile")}
            </TabsTrigger>
            <TabsTrigger
              value="tablet"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Tablet className="h-4 w-4" />
              {t("thumbnail.preview.tabs.tablet")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="desktop" className="mt-4">
            <div className="mx-auto max-w-4xl">
              <DesktopPreview
                thumbnailUrl={thumbnailUrl}
                title={title}
                channel={channel}
                views={views}
                timeAgo={timeAgo}
                duration={duration}
              />
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-4">
            <div className="mx-auto max-w-sm">
              <MobilePreview
                thumbnailUrl={thumbnailUrl}
                title={title}
                channel={channel}
                views={views}
                timeAgo={timeAgo}
                duration={duration}
              />
            </div>
          </TabsContent>

          <TabsContent value="tablet" className="mt-4">
            <div className="mx-auto max-w-2xl">
              <TabletPreview
                thumbnailUrl={thumbnailUrl}
                title={title}
                channel={channel}
                views={views}
                timeAgo={timeAgo}
                duration={duration}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
