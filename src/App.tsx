import { Navigate, Route, Routes } from "react-router";
import { SetupPage } from "@/pages/SetupPage";
import { IntentListPage } from "@/pages/IntentListPage";
import { IntentNewPage } from "@/pages/IntentNewPage";
import { IntentEditPage } from "@/pages/IntentEditPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/intents" replace />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/intents" element={<IntentListPage />} />
      <Route path="/intents/new" element={<IntentNewPage />} />
      <Route path="/intents/:id/edit" element={<IntentEditPage />} />
      <Route path="*" element={<Navigate to="/intents" replace />} />
    </Routes>
  );
}
