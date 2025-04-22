"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { useSession } from "@/lib/auth/auth-client";
import { User } from "better-auth";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: IconDashboard,
    },
    {
      title: "Properties",
      url: "/app/properties",
      icon: IconFolder,
    },
    {
      title: "Bookings",
      url: "/app/bookings",
      icon: IconListDetails,
    },
    {
      title: "Calendar",
      url: "/app/calendar",
      icon: IconChartBar,
    },
    {
      title: "Staff",
      url: "/app/staff",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Rooms",
      icon: IconCamera,
      url: "/app/rooms",
      items: [
        {
          title: "All Rooms",
          url: "/app/rooms",
        },
        {
          title: "Room Types",
          url: "/app/rooms/types",
        },
      ],
    },
    {
      title: "Amenities",
      icon: IconFileDescription,
      url: "/app/amenities",
      items: [
        {
          title: "Hotel Amenities",
          url: "/app/amenities/hotel",
        },
        {
          title: "Room Amenities",
          url: "/app/amenities/room",
        },
      ],
    },
    {
      title: "Reports",
      icon: IconReport,
      url: "/app/reports",
      items: [
        {
          title: "Occupancy",
          url: "/app/reports/occupancy",
        },
        {
          title: "Revenue",
          url: "/app/reports/revenue",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/app/settings",
      icon: IconSettings,
    },
    {
      title: "Support",
      url: "/app/support",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Guest Directory",
      url: "/app/guests",
      icon: IconDatabase,
    },
    {
      name: "Invoices",
      url: "/app/invoices",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  console.log({session});

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Stay In Puri </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {session && <NavUser user={session.user as User} />}
      </SidebarFooter>
    </Sidebar>
  );
}
