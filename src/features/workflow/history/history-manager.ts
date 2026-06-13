import type { WorkflowState, HistorySnapshot } from "@/types";

const MAX_HISTORY_SIZE = 50;

export type HistoryCommand =
  | { type: "ADD_NODE"; nodeId: string; before: WorkflowState; after: WorkflowState }
  | { type: "DELETE_NODE"; nodeId: string; before: WorkflowState; after: WorkflowState }
  | { type: "MOVE_NODE"; nodeId: string; before: WorkflowState; after: WorkflowState }
  | { type: "ADD_EDGE"; edgeId: string; before: WorkflowState; after: WorkflowState }
  | { type: "DELETE_EDGE"; edgeId: string; before: WorkflowState; after: WorkflowState }
  | { type: "UPDATE_NODE"; nodeId: string; before: WorkflowState; after: WorkflowState }
  | { type: "BATCH"; label: string; before: WorkflowState; after: WorkflowState };

export class HistoryManager {
  private undoStack: HistoryCommand[] = [];
  private redoStack: HistoryCommand[] = [];
  private snapshots: HistorySnapshot[] = [];

  push(command: HistoryCommand): void {
    this.undoStack.push(command);
    if (this.undoStack.length > MAX_HISTORY_SIZE) {
      this.undoStack.shift();
    }
    this.redoStack = [];

    const snapshot: HistorySnapshot = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      label: this.getCommandLabel(command),
      state: structuredClone(command.after),
    };
    this.snapshots.push(snapshot);
    if (this.snapshots.length > MAX_HISTORY_SIZE) {
      this.snapshots.shift();
    }
  }

  undo(): WorkflowState | null {
    const command = this.undoStack.pop();
    if (!command) return null;
    this.redoStack.push(command);
    return structuredClone(command.before);
  }

  redo(): WorkflowState | null {
    const command = this.redoStack.pop();
    if (!command) return null;
    this.undoStack.push(command);
    return structuredClone(command.after);
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getSnapshots(): HistorySnapshot[] {
    return [...this.snapshots];
  }

  restoreSnapshot(snapshotId: string): WorkflowState | null {
    const snapshot = this.snapshots.find((s) => s.id === snapshotId);
    return snapshot ? structuredClone(snapshot.state) : null;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.snapshots = [];
  }

  private getCommandLabel(command: HistoryCommand): string {
    switch (command.type) {
      case "ADD_NODE":
        return "Add node";
      case "DELETE_NODE":
        return "Delete node";
      case "MOVE_NODE":
        return "Move node";
      case "ADD_EDGE":
        return "Add connection";
      case "DELETE_EDGE":
        return "Delete connection";
      case "UPDATE_NODE":
        return "Update node";
      case "BATCH":
        return command.label;
      default:
        return "Change";
    }
  }
}

export const historyManager = new HistoryManager();
