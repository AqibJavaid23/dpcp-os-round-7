import type { ModelRoute, ModelTaskType } from "@/lib/types";

/** Add a model here. Nothing else in the app should import a provider SDK. */
export interface CatalogModel {
  id: string;
  label: string;
  provider: "grok" | "gemini" | "other";
}

export const MODEL_CATALOG: CatalogModel[] = [
  { id: "grok", label: "Grok", provider: "grok" },
  { id: "gemini", label: "Gemini", provider: "gemini" },
  { id: "other", label: "Other (from config)", provider: "other" },
];

export function defaultModelRoutes(): ModelRoute[] {
  return [
    { taskType: "drafts", label: "Drafts and replies", primary: "grok", backup: "gemini" },
    { taskType: "review", label: "Review revisions", primary: "grok", backup: "gemini" },
    { taskType: "checkin", label: "Daily check-in calls", primary: "grok", backup: "gemini" },
    { taskType: "background", label: "Background jobs", primary: "grok", backup: "gemini" },
    { taskType: "router", label: "Ask and route", primary: "grok", backup: "gemini" },
    { taskType: "summaries", label: "Meeting summaries", primary: "grok", backup: "gemini" },
  ];
}

export function catalogModel(id: string): CatalogModel {
  return MODEL_CATALOG.find((m) => m.id === id) ?? MODEL_CATALOG[0];
}

export interface ResolvedCall {
  taskType: ModelTaskType;
  model: CatalogModel;
  role: "primary" | "backup";
  note: string;
}

/**
 * The only door to a model. The prototype does not make a network call.
 * A later client replaces the body of this function and leaves the signature.
 */
export function callModel(input: {
  routes: ModelRoute[];
  taskType: ModelTaskType;
  prompt: string;
  useBackup?: boolean;
}): ResolvedCall {
  const route = input.routes.find((r) => r.taskType === input.taskType) ?? defaultModelRoutes()[0];
  const id = input.useBackup ? route.backup : route.primary;
  const model = catalogModel(id);
  const role = input.useBackup ? "backup" : "primary";
  return {
    taskType: input.taskType,
    model,
    role,
    note: `${model.label} · ${role} · ${route.label}`,
  };
}
