// ImportantDate API client
import { api } from "./client";
import type { ApiImportantDate } from "./types";

export const importantDatesApi = {
  list: (params?: { personId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.personId) qs.set("personId", params.personId);
    const q = qs.toString();
    return api<ApiImportantDate[]>(
      `/api/important-dates${q ? `?${q}` : ""}`
    );
  },
  create: (input: {
    personId: string;
    label: string;
    dateValue: string;
  }) =>
    api<ApiImportantDate>("/api/important-dates", {
      method: "POST",
      body: input,
    }),
  update: (
    id: string,
    input: { label?: string; dateValue?: string }
  ) =>
    api<ApiImportantDate>(`/api/important-dates/${id}`, {
      method: "PUT",
      body: input,
    }),
  remove: (id: string) =>
    api<{ ok: boolean }>(`/api/important-dates/${id}`, {
      method: "DELETE",
    }),
};
