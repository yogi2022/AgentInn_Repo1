"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookText,
  FileText,
  BrainCircuit,
  Paintbrush,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    tooltip: "Dashboard",
  },
  {
    href: "/content-generator",
    label: "Content Generator",
    icon: BookText,
    tooltip: "Content Generator",
  },
  {
    href: "/differentiated-worksheet",
    label: "Worksheet Generator",
    icon: FileText,
    tooltip: "Worksheet Generator",
  },
  {
    href: "/knowledge-base",
    label: "Knowledge Base",
    icon: BrainCircuit,
    tooltip: "Knowledge Base",
  },
  {
    href: "/visual-aid",
    label: "Visual Aid",
    icon: Paintbrush,
    tooltip: "Visual Aid",
  },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4 border-b">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.tooltip}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center h-14 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
             <h1 className="text-lg font-semibold font-headline">
              {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </>
  );
}
