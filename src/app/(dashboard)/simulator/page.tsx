"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { ExecutionControls } from "@/components/simulator/execution-controls";
import { StreamingConsole } from "@/components/simulator/streaming-console";
import { ExecutionLogs } from "@/components/simulator/execution-logs";
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas";

function SimulatorContent() {
  return (
    <PageContainer className="gap-4">
      <PageHeader
        title="Execution Simulator"
        description="Run, monitor, and debug workflow executions in real-time"
      />

      <ExecutionControls />

      <div className="grid gap-4 lg:grid-cols-2" style={{ minHeight: 300 }}>
        <StreamingConsole />
        <ExecutionLogs />
      </div>

      <div className="h-[400px] overflow-hidden rounded-xl border border-border">
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      </div>
    </PageContainer>
  );
}

export default function SimulatorPage() {
  return <SimulatorContent />;
}
