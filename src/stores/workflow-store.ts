import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Viewport,
  addEdge,
} from "@xyflow/react";
import type { WorkflowNode, WorkflowEdge, WorkflowState } from "@/types";
import { historyManager, type HistoryCommand } from "@/features/workflow/history/history-manager";
import { validateConnection } from "@/features/workflow/validation/connection-rules";
import { NODE_REGISTRY } from "@/features/workflow/nodes/node-registry";
import type { NodeType } from "@/types";

interface WorkflowStore {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;
  selectedNodeId: string | null;
  clipboard: WorkflowNode[];
  isConnecting: boolean;
  invalidConnection: boolean;

  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setViewport: (viewport: Viewport) => void;
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;
  onConnect: (connection: Connection) => boolean;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  deleteSelected: () => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  copySelected: () => void;
  paste: (position: { x: number; y: number }) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getState: () => WorkflowState;
  loadState: (state: WorkflowState) => void;
  pushHistory: (command: HistoryCommand) => void;
  setNodeExecutionState: (
    nodeId: string,
    state: "idle" | "running" | "success" | "error" | "paused"
  ) => void;
  resetExecutionStates: () => void;
}

function getCurrentState(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  viewport: Viewport
): WorkflowState {
  return { nodes: structuredClone(nodes), edges: structuredClone(edges), viewport: { ...viewport } };
}

export const useWorkflowStore = create<WorkflowStore>()(
  subscribeWithSelector((set, get) => ({
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
    selectedNodeId: null,
    clipboard: [],
    isConnecting: false,
    invalidConnection: false,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setViewport: (viewport) => set({ viewport }),

    onNodesChange: (changes) => {
      const before = getCurrentState(get().nodes, get().edges, get().viewport);
      const newNodes = applyNodeChanges(changes, get().nodes);
      set({ nodes: newNodes });

      const hasPositionChange = changes.some(
        (c) => c.type === "position" && c.dragging === false
      );
      if (hasPositionChange) {
        const after = getCurrentState(newNodes, get().edges, get().viewport);
        historyManager.push({
          type: "MOVE_NODE",
          nodeId: changes.find((c) => c.type === "position")?.id ?? "",
          before,
          after,
        });
      }
    },

    onEdgesChange: (changes) => {
      const before = getCurrentState(get().nodes, get().edges, get().viewport);
      const newEdges = applyEdgeChanges(changes, get().edges);
      set({ edges: newEdges });

      const hasRemove = changes.some((c) => c.type === "remove");
      if (hasRemove) {
        const after = getCurrentState(get().nodes, newEdges, get().viewport);
        historyManager.push({
          type: "DELETE_EDGE",
          edgeId: changes.find((c) => c.type === "remove")?.id ?? "",
          before,
          after,
        });
      }
    },

    onConnect: (connection) => {
      const sourceNode = get().nodes.find((n) => n.id === connection.source);
      const targetNode = get().nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const validation = validateConnection(
        sourceNode.data.nodeType,
        sourceNode.data.category,
        targetNode.data.nodeType,
        targetNode.data.category
      );

      if (!validation.valid) {
        set({ invalidConnection: true });
        setTimeout(() => set({ invalidConnection: false }), 600);
        return false;
      }

      const before = getCurrentState(get().nodes, get().edges, get().viewport);
      const newEdge: WorkflowEdge = {
        ...connection,
        id: crypto.randomUUID(),
        type: "animated",
        animated: true,
        style: { stroke: "#7C3AED", strokeWidth: 2 },
      };
      const newEdges = addEdge(newEdge, get().edges);
      set({ edges: newEdges });

      const after = getCurrentState(get().nodes, newEdges, get().viewport);
      historyManager.push({
        type: "ADD_EDGE",
        edgeId: newEdge.id,
        before,
        after,
      });

      return true;
    },

    addNode: (type, position) => {
      const config = NODE_REGISTRY[type];
      const before = getCurrentState(get().nodes, get().edges, get().viewport);

      const newNode: WorkflowNode = {
        id: crypto.randomUUID(),
        type: "workflowNode",
        position,
        data: {
          label: config.label,
          description: config.description,
          nodeType: type,
          category: config.category,
          config: { ...config.defaultData },
          validationState: "valid",
          executionState: "idle",
        },
      };

      const newNodes = [...get().nodes, newNode];
      set({ nodes: newNodes, selectedNodeId: newNode.id });

      const after = getCurrentState(newNodes, get().edges, get().viewport);
      historyManager.push({ type: "ADD_NODE", nodeId: newNode.id, before, after });
    },

    deleteSelected: () => {
      const { selectedNodeId, nodes, edges } = get();
      if (!selectedNodeId) return;

      const before = getCurrentState(nodes, edges, get().viewport);
      const newNodes = nodes.filter((n) => n.id !== selectedNodeId);
      const newEdges = edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
      );
      set({ nodes: newNodes, edges: newEdges, selectedNodeId: null });

      const after = getCurrentState(newNodes, newEdges, get().viewport);
      historyManager.push({ type: "DELETE_NODE", nodeId: selectedNodeId, before, after });
    },

    selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

    updateNodeConfig: (nodeId, config) => {
      const before = getCurrentState(get().nodes, get().edges, get().viewport);
      const newNodes = get().nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, config: { ...n.data.config, ...config } } }
          : n
      );
      set({ nodes: newNodes });

      const after = getCurrentState(newNodes, get().edges, get().viewport);
      historyManager.push({ type: "UPDATE_NODE", nodeId, before, after });
    },

    copySelected: () => {
      const { selectedNodeId, nodes } = get();
      if (!selectedNodeId) return;
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) set({ clipboard: [structuredClone(node)] });
    },

    paste: (position) => {
      const { clipboard, nodes, edges } = get();
      if (clipboard.length === 0) return;

      const before = getCurrentState(nodes, edges, get().viewport);
      const newNodes = clipboard.map((node) => ({
        ...structuredClone(node),
        id: crypto.randomUUID(),
        position: { x: position.x + 20, y: position.y + 20 },
        selected: true,
      }));

      const allNodes = [...nodes.map((n) => ({ ...n, selected: false })), ...newNodes];
      set({ nodes: allNodes, selectedNodeId: newNodes[0]?.id ?? null });

      const after = getCurrentState(allNodes, edges, get().viewport);
      historyManager.push({ type: "BATCH", label: "Paste nodes", before, after });
    },

    undo: () => {
      const state = historyManager.undo();
      if (state) {
        set({ nodes: state.nodes, edges: state.edges, viewport: state.viewport });
      }
    },

    redo: () => {
      const state = historyManager.redo();
      if (state) {
        set({ nodes: state.nodes, edges: state.edges, viewport: state.viewport });
      }
    },

    canUndo: () => historyManager.canUndo(),
    canRedo: () => historyManager.canRedo(),

    getState: () => getCurrentState(get().nodes, get().edges, get().viewport),

    loadState: (state) => {
      set({
        nodes: state.nodes,
        edges: state.edges,
        viewport: state.viewport,
      });
    },

    pushHistory: (command) => historyManager.push(command),

    setNodeExecutionState: (nodeId, executionState) => {
      set({
        nodes: get().nodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, executionState } } : n
        ),
      });
    },

    resetExecutionStates: () => {
      set({
        nodes: get().nodes.map((n) => ({
          ...n,
          data: { ...n.data, executionState: "idle" as const },
        })),
      });
    },
  }))
);
