import { create } from "zustand";
import type { Notification } from "@/types";

interface UIStore {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  searchQuery: string;
  notifications: Notification[];

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;
}

export const useUIStore = create<UIStore>((set, get) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationPanelOpen: false,
  searchQuery: "",
  notifications: [
    {
      id: "1",
      title: "Budget Alert",
      message: "You've used 85% of your monthly AI budget",
      type: "budget",
      read: false,
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      title: "Workflow Published",
      message: "Customer Support Agent v2 is now live",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      title: "Usage Spike",
      message: "Token usage increased 340% in the last hour",
      type: "spike",
      read: true,
      createdAt: new Date(Date.now() - 86400000),
    },
  ],

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addNotification: (notification) =>
    set((s) => ({
      notifications: [
        {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date(),
        },
        ...s.notifications,
      ],
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
