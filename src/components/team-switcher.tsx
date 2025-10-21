"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-1 rounded-lg px-3 py-2 cursor-default"
        >
          <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image src="/logo.png" alt="logo" width={50} height={50} />
          </div>

          <span className="font-medium text-sm truncate">
            Transport Management System
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
