// Backend(localhost:5000) 응답 타입
// MongoDB 모델과 1:1 매핑

export type IntentType = "do" | "avoid";

export type Quadrant =
  | "aligned"
  | "procrastinated"
  | "relapsed"
  | "resisted";

export type SessionType = "realtime" | "daily_review";

export interface ApiPerson {
  _id: string;
  userId: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiImportantDate {
  _id: string;
  personId: string;
  userId: string;
  label: string;
  dateValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiIntent {
  _id: string;
  personId: string;
  userId: string;
  intentType: IntentType;
  title: string;
  why: string | null;
  dueDate: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiIntentEvent {
  _id: string;
  intentId: string | null;
  personId: string;
  userId: string;
  quadrant: Quadrant;
  recordedAt: string;
  triggerNote: string | null;
  sessionType: SessionType;
  createdAt: string;
  updatedAt: string;
}
