import { Navigate, Route, Routes } from "react-router";
import { useActivePerson } from "@/api/useActivePerson";
import { SplashPage } from "@/pages/SplashPage";
import { SetupPage } from "@/pages/SetupPage";
import { IntentListPage } from "@/pages/IntentListPage";
import { IntentNewPage } from "@/pages/IntentNewPage";
import { IntentEditPage } from "@/pages/IntentEditPage";

/**
 * 루트 진입 분기.
 * - person 로딩 중에는 빈 화면 (깜빡임 방지)
 * - person 있음: 곧바로 /intents 로
 * - person 없음: SplashPage 노출 ("시작하기" → /setup)
 */
function RootRedirect() {
  const { person, loading } = useActivePerson();
  if (loading) return <div className="clean clean-container" />;
  if (person) return <Navigate to="/intents" replace />;
  return <SplashPage />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/intents" element={<IntentListPage />} />
      <Route path="/intents/new" element={<IntentNewPage />} />
      <Route path="/intents/:id/edit" element={<IntentEditPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
