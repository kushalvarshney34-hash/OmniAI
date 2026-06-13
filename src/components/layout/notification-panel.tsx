"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertTriangle,
  budget: AlertTriangle,
  spike: TrendingUp,
  anomaly: AlertTriangle,
};

const typeColors = {
  info: "text-primary",
  success: "text-success",
  warning: "text-warning",
  error: "text-danger",
  budget: "text-warning",
  spike: "text-danger",
  anomaly: "text-warning",
};

export function NotificationPanel() {
  const {
    notificationPanelOpen,
    setNotificationPanelOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useUIStore();

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setNotificationPanelOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-border bg-card shadow-float"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-semibold">Notifications</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllNotificationsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationPanelOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {notifications.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markNotificationRead(notification.id)}
                      className={cn(
                        "flex w-full gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          typeColors[notification.type]
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted">{notification.message}</p>
                        <p className="text-xs text-muted/70">
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
