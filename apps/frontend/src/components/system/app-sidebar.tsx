"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/app/i18n/navigation";
import { Link } from "@/app/i18n/navigation";
import {
  LayoutDashboard,
  Youtube,
  BarChart3,
  Image,
  Settings,
  ChevronRight,
  SeparatorHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { Separator } from "radix-ui";
import { UserAuthBadge } from "./user-auth-badge";

export function AppSidebar() {
  const t = useTranslations("sidebar");
  const pathname = usePathname();

  return (
    <Sidebar className="flex h-screen flex-col border-r ">
      <SidebarHeader className="border-b">
        <div className="grid sm:grid-cols-2">
          <div className="py-1">
            <span className="text-lg font-bold">YTBoard</span>
          </div>
          <div className="flex justify-end align-end">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href="/">
                    <LayoutDashboard />
                    <span>{t("dashboard")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* YouTube (collapsible) */}
              <Collapsible
                defaultOpen={pathname.startsWith("/youtube")}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="data-[active=true]:bg-primary data-[active=true]:text-white">
                      <Youtube />
                      <span>{t("youtube")}</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === "/youtube/statistics"}
                          className="data-[active=true]:bg-primary data-[active=true]:text-white"
                        >
                          <Link href="/youtube/statistics">
                            <BarChart3 className="text-white" />
                            <span>{t("statistics")}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === "/youtube/thumbnails"}
                          className="data-[active=true]:bg-primary data-[active=true]:text-white"
                        >
                          <Link href="/youtube/thumbnails">
                            <Image />
                            <span>{t("thumbnail")}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/settings"}
                  className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  <Link href="/settings">
                    <Settings />
                    <span>{t("settings")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="border-t p-4">
        <UserAuthBadge />
      </div>
    </Sidebar>
  );
}
