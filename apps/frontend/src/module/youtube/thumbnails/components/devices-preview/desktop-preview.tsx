import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { ThumbnailPlaceholder } from "../thumbnail-placeholder";
import { Bell, Menu, MoreVertical, Play, Search, User } from "lucide-react";

interface PreviewProps {
  thumbnailUrl: string | null;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
}

export const DesktopPreview = ({
  thumbnailUrl,
  title,
  channel,
  views,
  timeAgo,
  duration,
}: PreviewProps) => {
  const t = useTranslations("youtube");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
        <div className="ml-4 flex flex-1 items-center gap-2 rounded-full bg-muted/80 px-3 py-1">
          <Search className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {t("thumbnail.preview.desktop.urlPlaceholder")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-4">
          <Menu className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <Play className="h-5 w-5 fill-primary text-primary" />
            <span className="text-sm font-bold text-foreground">
              {t("thumbnail.preview.brand.youtube")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
            <User className="h-3 w-3 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="flex flex-col gap-2">
          <div className="relative">
            {thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt={t("thumbnail.preview.alt.desktop")}
                className="aspect-video w-full rounded-lg object-cover"
              />
            ) : (
              <ThumbnailPlaceholder className="aspect-video w-full rounded-lg" />
            )}
            <Badge className="absolute bottom-1.5 right-1.5 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-background/80">
              {duration}
            </Badge>
          </div>
          <div className="flex gap-2.5">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
                {title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{channel}</p>
              <p className="text-xs text-muted-foreground">
                {views} {t("thumbnail.metadata.fields.views").toLowerCase()} ·{" "}
                {timeAgo}
              </p>
            </div>
          </div>
        </div>

        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2 opacity-30">
            <div className="aspect-video w-full rounded-lg bg-muted" />
            <div className="flex gap-2.5">
              <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-muted" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
                <div className="h-2.5 w-1/2 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
