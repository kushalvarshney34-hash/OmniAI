"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import { Save, Play, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";
import { NodePalette } from "@/components/workflow/node-palette";
import { NodeConfigPanel } from "@/components/workflow/node-config-panel";
import { HistoryTimeline } from "@/components/workflow/history-timeline";
import { useWorkflowStore } from "@/stores/workflow-store";

function WorkflowBuilderContent() {
  const router = useRouter();
  const { nodes, edges, viewport, addNode, loadState } = useWorkflowStore();

  useEffect(() => {
    if (nodes.length === 0) {
      addNode("openai", { x: 200, y: 200 });
      addNode("ifElse", { x: 500, y: 200 });
      addNode("postgresql", { x: 800, y: 150 });
      addNode("gmail", { x: 800, y: 300 });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    const state = { nodes, edges, viewport };
    localStorage.setItem("omniagent-workflow-draft", JSON.stringify(state));
    toast.success("Workflow saved", { description: "Your changes have been saved locally." });
  }, [nodes, edges, viewport]);

  const handleRun = useCallback(() => {
    router.push("/simulator");
  }, [router]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex h-12 items-center justify-between border-b border-border bg-card/30 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workflows")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            defaultValue="Untitled Workflow"
            className="h-8 w-64 border-none bg-transparent text-sm font-semibold focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={handleRun}>
            <Play className="h-4 w-4" />
            Run
          </Button>
        </div>
      </div>

      <HistoryTimeline />

      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <div className="flex-1">
          <WorkflowCanvas />
        </div>
        <NodeConfigPanel />
      </div>
    </div>
  );
}

export default function NewWorkflowPage() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  );
}
