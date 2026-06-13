"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GitBranch, Plus, Clock, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_WORKFLOWS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function WorkflowsPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <PageHeader
        title="Workflows"
        description="Visual AI agent workflow builder"
        actions={
          <Button onClick={() => router.push("/workflows/new")}>
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_WORKFLOWS.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2 }}
          >
            <Card
              className="group cursor-pointer glass transition-all hover:border-primary/30 hover:shadow-glow"
              onClick={() => router.push(`/workflows/${workflow.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <GitBranch className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant={workflow.status === "PUBLISHED" ? "success" : "outline"}>
                    {workflow.status}
                  </Badge>
                </div>

                <h3 className="mt-4 font-semibold group-hover:text-primary transition-colors">
                  {workflow.name}
                </h3>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                  <span>{workflow.nodes} nodes</span>
                  <span className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    {formatNumber(workflow.executions)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: MOCK_WORKFLOWS.length * 0.08 }}
        >
          <Card
            className="flex h-full min-h-[180px] cursor-pointer items-center justify-center border-dashed glass transition-all hover:border-primary/50 hover:bg-primary/5"
            onClick={() => router.push("/workflows/new")}
          >
            <CardContent className="flex flex-col items-center gap-2 p-6 text-muted">
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">Create New Workflow</span>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageContainer>
  );
}
