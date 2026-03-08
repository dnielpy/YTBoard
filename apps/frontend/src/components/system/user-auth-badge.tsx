"use client";

import { useEffect, useState } from "react";
import {
  ChevronsUpDown,
  LogOut,
  Youtube,
  Instagram,
  Unplug,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  getConnectedAccount,
  getGoogleAuthUrl,
  type ConnectedAccount,
} from "@/lib/api/accounts";

const AVAILABLE_SERVICES = [
  { key: "youtube", name: "YouTube", icon: Youtube },
  { key: "instagram", name: "Instagram", icon: Instagram },
] as const;

export const UserAuthBadge = () => {
  const { data: session, status } = useSession();
  const { isMobile } = useSidebar();
  const t = useTranslations("sidebar.user");

  const [connectedAccount, setConnectedAccount] =
    useState<ConnectedAccount | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);

  const loading = status === "loading";
  const userName = session?.user?.email ?? "...";
  const userEmail = session?.user?.email ?? "";
  const firstLetter = userName?.charAt(0)?.toUpperCase() ?? "?";

  useEffect(() => {
    if (status === "authenticated") {
      getConnectedAccount()
        .then(setConnectedAccount)
        .catch(() => setConnectedAccount(null));
    }
  }, [status]);

  const connectedServiceKeys = connectedAccount ? ["youtube"] : [];

  const services = AVAILABLE_SERVICES.filter((s) =>
    connectedServiceKeys.includes(s.key),
  );

  const handleConnectYouTube = async () => {
    try {
      setConnectLoading(true);
      const callbackPath = `${window.location.origin}/${document.documentElement.lang || "en"}/auth/google/callback`;
      const { auth_url } = await getGoogleAuthUrl(callbackPath);
      window.location.href = auth_url;
    } catch {
      setConnectLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {loading ? "..." : firstLetter}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {loading ? t("loading") : userName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {firstLetter}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("connectedServices")}
              </DropdownMenuLabel>
              {services.length > 0 ? (
                services.map((service) => (
                  <DropdownMenuItem key={service.key}>
                    <service.icon />
                    <span>
                      {service.name}
                      {connectedAccount
                        ? ` (${connectedAccount.channel_handle})`
                        : ""}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem
                  onClick={handleConnectYouTube}
                  disabled={connectLoading}
                >
                  {connectLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Youtube className="size-4" />
                  )}
                  <span>{t("connectYouTube")}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
