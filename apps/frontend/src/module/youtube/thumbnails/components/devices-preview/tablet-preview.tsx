import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Bell, Play, Search, User } from "lucide-react";
import { ThumbnailPlaceholder } from "../thumbnail-placeholder";

export interface PreviewProps {
  thumbnailUrl: string | null;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
}

export const TabletPreview = ({
  thumbnailUrl,
  title,
  channel,
  views,
  timeAgo,
  duration,
}: PreviewProps) => {
  const t = useTranslations("youtube");

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-border bg-card">
      <div className="flex items-center justify-between bg-card px-6 pt-2 pb-1">
        <span className="text-[10px] font-semibold text-foreground">
          {t("thumbnail.preview.statusBar.time")}
        </span>
        <div className="flex gap-1.5">
          <div className="h-2 w-3.5 rounded-sm bg-muted-foreground" />
          <div className="h-2 w-2.5 rounded-sm bg-muted-foreground" />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Play className="h-5 w-5 fill-primary text-primary" />
          <span className="text-sm font-bold text-foreground">
            {t("thumbnail.preview.brand.youtube")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <User className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="relative">
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt={t("thumbnail.preview.alt.tablet")}
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <ThumbnailPlaceholder className="aspect-video w-full rounded-lg" />
            )}
            <Badge className="absolute bottom-1 right-1 bg-background/80 px-1 py-0.5 text-[10px] font-medium text-foreground hover:bg-background/80">
              {duration}
            </Badge>
          </div>
          <div className="flex gap-2">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
                {title}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {channel} · {views}{" "}
                {t("thumbnail.metadata.fields.views").toLowerCase()} · {timeAgo}
              </p>
            </div>
          </div>
        </div>

        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2 opacity-25">
            <div className="aspect-video w-full rounded-lg bg-muted" />
            <div className="flex gap-2">
              <div className="h-7 w-7 shrink-0 rounded-full bg-muted" />
              <div className="flex flex-1 flex-col gap-1">
                <div className="h-2.5 w-full rounded bg-muted" />
                <div className="h-2 w-3/4 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
