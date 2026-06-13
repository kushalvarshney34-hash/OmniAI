"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { MOCK_WORKFLOWS } from "@/lib/mock-data";

function WorkflowEditorContent() {
  const router = useRouter();
  const params = useParams();
  const workflowId = params.id as string;
  const workflow = MOCK_WORKFLOWS.find((w) => w.id === workflowId);
  const { nodes, edges, viewport, addNode, loadState } = useWorkflowStore();

  useEffect(() => {
    const saved = localStorage.getItem(`omniagent-workflow-${workflowId}`);
    if (saved) {
      loadState(JSON.parse(saved));
    } else if (nodes.length === 0) {
      addNode("openai", { x: 200, y: 200 });
      addNode("ifElse", { x: 500, y: 200 });
      addNode("slack", { x: 800, y: 200 });
    }
  }, [workflowId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = useCallback(() => {
    const state = { nodes, edges, viewport };
    localStorage.setItem(`omniagent-workflow-${workflowId}`, JSON.stringify(state));
    toast.success("Workflow saved");
  }, [nodes, edges, viewport, workflowId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex h-12 items-center justify-between border-b border-border bg-card/30 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/workflows")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Input
            defaultValue={workflow?.name ?? "Workflow"}
            className="h-8 w-64 border-none bg-transparent text-sm font-semibold focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={() => router.push("/simulator")}>
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

export default function WorkflowEditorPage() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  );
}
