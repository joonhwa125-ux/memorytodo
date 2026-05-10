// Intent API client
import { api } from "./client";
import type { ApiIntent, IntentType } from "./types";

export interface CreateIntentInput {
  personId: string;
  intentType: IntentType;
  title: string;
  why?: string | null;
  dueDate?: string | null;
}

export interface UpdateIntentInput {
  title?: string;
  why?: string | null;
  dueDate?: string | null;
  intentType?: IntentType;
  isArchived?: boolean;
}

export const intentsApi = {
  list: (params?: { personId?: string; includeArchived?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.personId) qs.set("personId", params.personId);
    if (params?.includeArchived) qs.set("includeArchived", "true");
    const q = qs.toString();
    return api<ApiIntent[]>(`/api/intents${q ? `?${q}` : ""}`);
  },
  get: (id: string) => api<ApiIntent>(`/api/intents/${id}`),
  create: (input: CreateIntentInput) =>
    api<ApiIntent>("/api/intents", { method: "POST", body: input }),
  update: (id: string, input: UpdateIntentInput) =>
    api<ApiIntent>(`/api/intents/${id}`, { method: "PUT", body: input }),
  remove: (id: string) =>
    api<{ ok: boolean }>(`/api/intents/${id}`, { method: "DELETE" }),
};
