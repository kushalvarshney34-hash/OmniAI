"use client";

import { memo, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "sonner";
import { WorkflowNode } from "@/components/workflow/workflow-node";
import { AnimatedEdge } from "@/components/workflow/animated-edge";
import { useWorkflowStore } from "@/stores/workflow-store";
import { validateConnection } from "@/features/workflow/validation/connection-rules";
import type { WorkflowNode as WFNode, WorkflowEdge } from "@/types";

const nodeTypes = { workflowNode: WorkflowNode };
const edgeTypes = { animated: AnimatedEdge };

interface WorkflowCanvasProps {
  onInit?: (instance: ReactFlowInstance<WFNode, WorkflowEdge>) => void;
}

function WorkflowCanvasComponent({ onInit }: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    undo,
    redo,
    deleteSelected,
    copySelected,
    paste,
    invalidConnection,
  } = useWorkflowStore();

  useEffect(() => {
    if (invalidConnection) {
      toast.error("Invalid connection", {
        description: "These node types cannot be connected directly.",
      });
    }
  }, [invalidConnection]);

  const handleInit = useCallback(
    (instance: ReactFlowInstance<WFNode, WorkflowEdge>) => {
      onInit?.(instance);
    },
    [onInit]
  );

  const handleConnect = useCallback(
    (connection: Parameters<typeof onConnect>[0]) => {
      onConnect(connection);
    },
    [onConnect]
  );

  const isValidConnection = useCallback(
    (connection: { source: string; target: string }) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return false;
      return validateConnection(
        sourceNode.data.nodeType,
        sourceNode.data.category,
        targetNode.data.nodeType,
        targetNode.data.category
      ).valid;
    },
    [nodes]
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: WFNode) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 100,
        y: event.clientY - bounds.top - 40,
      };

      addNode(type as Parameters<typeof addNode>[0], position);
    },
    [addNode]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (e.ctrlKey && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        copySelected();
      }
      if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        paste({ x: 300, y: 200 });
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteSelected, copySelected, paste]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full" onDrop={handleDrop} onDragOver={handleDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onInit={handleInit}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        isValidConnection={isValidConnection}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        minZoom={0.1}
        maxZoom={2}
        deleteKeyCode={null}
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#27272A" />
        <Controls className="!bg-card !border-border !shadow-card [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-accent" />
        <MiniMap
          className="!bg-card !border-border"
          nodeColor="#7C3AED"
          maskColor="rgba(9, 9, 11, 0.8)"
        />
        <Panel position="bottom-center" className="text-xs text-muted">
          Snap to grid • Ctrl+Z undo • Ctrl+Shift+Z redo • Shift+Click multi-select
        </Panel>
      </ReactFlow>
    </div>
  );
}

export const WorkflowCanvas = memo(WorkflowCanvasComponent);
