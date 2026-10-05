"use client";

import { Surface } from "@/components/bits";
import { MODEL_CATALOG, catalogModel } from "@/lib/models";
import { useApp } from "@/lib/store";
import type { ModelTaskType } from "@/lib/types";

export function ModelsPanel() {
  const app = useApp();
  const canEdit = app.ui.role === "administrator" || app.ui.role === "george";
  if (!canEdit && app.ui.role !== "george") {
    return null;
  }
  return (
    <Surface>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Models</p>
      <p className="mt-1 text-sm">
        Grok is primary. Gemini is the backup. Every call goes through one switch, so a task type can use a different model without a code change.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">There is no spend cap on these calls.</p>
      <div className="mt-4 space-y-4">
        {app.model.modelRoutes.map((route) => (
          <div key={route.taskType} className="grid gap-2 border-t border-border pt-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
            <p className="text-sm font-medium text-dpcp-navy">{route.label}</p>
            <ModelSelect
              label="Primary"
              value={route.primary}
              disabled={!canEdit}
              onChange={(modelId) => app.setModelRoute(route.taskType as ModelTaskType, "primary", modelId)}
            />
            <ModelSelect
              label="Backup"
              value={route.backup}
              disabled={!canEdit}
              onChange={(modelId) => app.setModelRoute(route.taskType as ModelTaskType, "backup", modelId)}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Active primary for drafts: {catalogModel(app.model.modelRoutes.find((r) => r.taskType === "drafts")?.primary ?? "grok").label}.
        Backup: {catalogModel(app.model.modelRoutes.find((r) => r.taskType === "drafts")?.backup ?? "gemini").label}.
      </p>
    </Surface>
  );
}

function ModelSelect({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (id: string) => void;
}) {
  return (
    <label className="block text-xs text-muted-foreground">
      {label}
      <select
        className="mt-1 h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-foreground"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      >
        {MODEL_CATALOG.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
    </label>
  );
}
