// Person API client
import { api } from "./client";
import type { ApiPerson } from "./types";

export const personsApi = {
  list: () => api<ApiPerson[]>("/api/persons"),
  get: (id: string) => api<ApiPerson>(`/api/persons/${id}`),
  create: (input: { displayName: string }) =>
    api<ApiPerson>("/api/persons", { method: "POST", body: input }),
  update: (id: string, input: { displayName?: string }) =>
    api<ApiPerson>(`/api/persons/${id}`, { method: "PUT", body: input }),
  remove: (id: string) =>
    api<{ ok: boolean }>(`/api/persons/${id}`, { method: "DELETE" }),
};
