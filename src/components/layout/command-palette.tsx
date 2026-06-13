"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  Play,
  BarChart3,
  Store,
  Users,
  Settings,
  Plus,
  Search,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUIStore } from "@/stores/ui-store";

const commands = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "agents", label: "Agents", icon: Bot, href: "/agents" },
  { id: "workflows", label: "Workflows", icon: GitBranch, href: "/workflows" },
  { id: "new-workflow", label: "New Workflow", icon: Plus, href: "/workflows/new" },
  { id: "simulator", label: "Simulator", icon: Play, href: "/simulator" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
  { id: "marketplace", label: "Marketplace", icon: Store, href: "/marketplace" },
  { id: "team", label: "Team", icon: Users, href: "/team" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const navigate = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigation">
              {commands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <Command.Item
                    key={cmd.id}
                    value={cmd.label}
                    onSelect={() => navigate(cmd.href)}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
                  >
                    <Icon className="h-4 w-4 text-muted" />
                    {cmd.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
