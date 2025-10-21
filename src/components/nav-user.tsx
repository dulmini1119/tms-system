"use client";

import { useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

interface NavUserProps {
  user: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/70 transition">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col pointer-events-none">
              <span className="text-sm font-medium">{user.name}</span>
              {user.role && (
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          <LogOut
            className="size-4 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={handleLogout}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
