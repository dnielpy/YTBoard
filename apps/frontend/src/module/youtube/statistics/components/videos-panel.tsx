"use client";

import { useState } from "react";
import Image from "next/image";
import { RefreshCw, PlaySquare, Clock, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { syncAccount, getVideos, VideoResponse } from "@/lib/api/accounts";

function parseDuration(iso: string | null): string {
  if (!iso) return "";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}:` : "";
  const m = match[2] ? match[2].padStart(h ? 2 : 1, "0") : "0";
  const s = (match[3] ?? "0").padStart(2, "0");
  return `${h}${m}:${s}`;
}

function VideoCard({ video }: { video: VideoResponse }) {
  const date = video.published_at
    ? new Date(video.published_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt={video.title ?? "Video thumbnail"}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PlaySquare className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {parseDuration(video.duration)}
          </span>
        )}
      </div>

      <CardContent className="p-3 space-y-1.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug">
          {video.title ?? "Untitled"}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {date && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {date}
            </span>
          )}
          {video.privacy && (
            <Badge
              variant={video.privacy === "public" ? "secondary" : "outline"}
              className="h-5 gap-1 px-1.5 text-[11px]"
            >
              {video.privacy !== "public" && <Lock className="h-2.5 w-2.5" />}
              {video.privacy}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function VideoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function VideosPanel() {
  const [videos, setVideos] = useState<VideoResponse[] | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setSyncing(true);
    setSyncMessage(null);
    setError(null);
    try {
      const res = await syncAccount();
      setSyncMessage(res.detail);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function handleGetVideos() {
    setLoading(true);
    setError(null);
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSync} disabled={syncing} variant="default">
          <RefreshCw
            className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`}
          />
          {syncing ? "Syncing…" : "Sync Videos"}
        </Button>

        <Button onClick={handleGetVideos} disabled={loading} variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          {loading ? "Loading…" : "Get Videos"}
        </Button>

        {syncMessage && (
          <span className="text-sm text-muted-foreground">{syncMessage}</span>
        )}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>

      {/* Video grid */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && videos !== null && videos.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <PlaySquare className="h-10 w-10" />
          <p className="text-sm">No videos found. Try syncing first.</p>
        </div>
      )}

      {!loading && videos !== null && videos.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
