"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bot, Play, Pause, MoreHorizontal, Plus } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_AGENTS } from "@/lib/mock-data";
import { formatNumber, formatPercent } from "@/lib/utils";

export default function AgentsPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <PageHeader
        title="Agents"
        description="Manage your deployed AI agents"
        actions={
          <Button onClick={() => router.push("/workflows/new")}>
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_AGENTS.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group glass transition-all hover:shadow-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted">{agent.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push("/simulator")}>
                        Run Simulator
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/workflows/wf-1")}>
                        Edit Workflow
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={agent.status === "active" ? "success" : "warning"}>
                    {agent.status}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Success Rate</span>
                    <span className="font-medium">{formatPercent(agent.successRate)}</span>
                  </div>
                  <Progress value={agent.successRate} />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {formatNumber(agent.executions)} executions
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/simulator")}
                  >
                    {agent.status === "active" ? (
                      <>
                        <Play className="h-3 w-3" /> Run
                      </>
                    ) : (
                      <>
                        <Pause className="h-3 w-3" /> Resume
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
