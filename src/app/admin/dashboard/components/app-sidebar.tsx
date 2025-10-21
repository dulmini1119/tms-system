"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  CheckSquare,
  Building2,
  Briefcase,
  Building,
  Car,
  FileText,
  Folder,
  Route,
  MapPin,
  DollarSign,
  Navigation,
  AlertTriangle,
  Bell,
  FileSearch,
  Settings,
} from "lucide-react";

import { NavMain } from "@/app/admin/dashboard/components/nav-main";
import { NavUser } from "@/app/admin/dashboard/components/nav-user";
import { TeamSwitcher } from "@/app/admin/dashboard/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { url } from "inspector";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
    url: "/admin/dashboard"
  },
  {
    title: "Users & Roles",
    icon: Users,
    id: "users-roles",
    children: [
      { title: "Users", icon: Users, id: "users", url:"/admin/users" },
      { title: "Roles", icon: Shield, id: "roles", url:"/admin/roles" },
      { title: "Permissions", icon: CheckSquare, id: "permissions" , url:"admin/permissions"},
    ],
  },
  {
    title: "Organization",
    icon: Building2,
    id: "organization",
    children: [
      { title: "Departments", icon: Briefcase, id: "departments" },
      { title: "Business Units", icon: Building, id: "business-units" },
    ],
  },
  {
    title: "Cab Services",
    icon: Car,
    id: "cab-services",
    children: [
      { title: "Cab Services", icon: Car, id: "cab-services-list" },
      { title: "Cab Agreements", icon: FileText, id: "cab-agreements" },
    ],
  },
  {
    title: "Vehicles & Documents",
    icon: Car,
    id: "vehicles-documents",
    children: [
      { title: "Vehicles", icon: Car, id: "vehicles" },
      { title: "Vehicle Documents", icon: FileText, id: "vehicle-documents" },
      { title: "Driver Documents", icon: Folder, id: "driver-documents" },
    ],
  },
  {
    title: "Trips",
    icon: Route,
    id: "trips",
    children: [
      { title: "Trip Requests", icon: MapPin, id: "trip-requests" },
      { title: "Trip Approvals", icon: CheckSquare, id: "trip-approvals" },
      { title: "Trip Assignments", icon: Users, id: "trip-assignments" },
      { title: "Trip Logs", icon: FileText, id: "trip-logs" },
      { title: "Trip Costs", icon: DollarSign, id: "trip-costs" },
    ],
  },
  {
    title: "Tracking & Alerts",
    icon: Navigation,
    id: "tracking-alerts",
    children: [
      { title: "GPS Logs", icon: Navigation, id: "gps-logs" },
      { title: "Expiry Alerts", icon: AlertTriangle, id: "expiry-alerts" },
    ],
  },
  {
    title: "Notifications & Audit",
    icon: Bell,
    id: "notifications-audit",
    children: [
      { title: "Notifications", icon: Bell, id: "notifications" },
      { title: "Audit Logs", icon: FileSearch, id: "audit-logs" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
  },
];

const data = {
  user: {
    name: "John Doe",
    email: "john@doe.com",
    role: "Super Admin",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>

      <SidebarFooter className="pb-5">
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
