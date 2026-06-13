"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Command,
  Plus,
  LogOut,
  User,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores/ui-store";
import { NotificationPanel } from "@/components/layout/notification-panel";
import { CommandPalette } from "@/components/layout/command-palette";

export function TopNav() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    setCommandPaletteOpen,
    setNotificationPanelOpen,
    notificationPanelOpen,
    unreadCount,
  } = useUIStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    },
    [setCommandPaletteOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card/30 px-6 backdrop-blur-xl"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search agents, workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setCommandPaletteOpen(true)}
            className="pl-9 bg-background/50"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border border-border bg-accent px-1.5 font-mono text-[10px] font-medium text-muted sm:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <Command className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/workflows/new")}
            className="hidden sm:flex"
          >
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            {unreadCount() > 0 && (
              <Badge
                variant="danger"
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]"
              >
                {unreadCount()}
              </Badge>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    KA
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Kush Admin</p>
                  <p className="text-xs text-muted">admin@omniagent.io</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Moon className="mr-2 h-4 w-4" />
                Dark Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-danger">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      <CommandPalette />
      <NotificationPanel />
    </>
  );
}
