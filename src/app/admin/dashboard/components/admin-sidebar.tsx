"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useState } from "react";

const items = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Inbox", url: "/admin/inbox", icon: Inbox },
  { title: "Calendar", url: "/admin/calendar", icon: Calendar },
  { title: "Search", url: "/admin/search", icon: Search },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);



  return (
    <div className="flex h-screen">
     
      <Sidebar
        className={`bg-gray-900 text-gray-100 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
      
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel
              className={isCollapsed ? "hidden" : "block"}
            >
              Application
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-gray-800 ${
                          isActive ? "bg-gray-800" : ""
                        } ${isCollapsed ? "justify-center" : ""}`}
                      >
                        <Link href={item.url}>
                          <item.icon className="mr-2" />
                          <span className={isCollapsed ? "hidden" : "block"}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      
    </div>
  );
}