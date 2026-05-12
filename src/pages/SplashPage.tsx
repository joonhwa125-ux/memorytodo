import { useNavigate } from "react-router";

/**
 * 첫 진입 화면. v4-clean.html 의 01번 frame과 동일한 인상.
 * person이 없는 방문자에게만 보여진다 (App에서 분기).
 */
export function SplashPage() {
  const navigate = useNavigate();

  return (
    <main className="clean">
      <div
        className="clean-container"
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 40,
          paddingBottom: 32,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.3,
              color: "var(--c-ink)",
              margin: "0 0 16px",
            }}
          >
            소중한 사람을 위한
            <br />
            <span style={{ color: "var(--c-accent)" }}>할 일</span>을 적어둡니다.
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--c-ink-2)",
              lineHeight: 1.6,
              maxWidth: 280,
              margin: 0,
            }}
          >
            하고 싶은 일과 하지 말아야 할 일.
            <br />
            그리고 그 사람과 남은 시간.
          </p>
        </div>

        <button
          type="button"
          className="clean-btn-primary"
          onClick={() => navigate("/setup")}
        >
          시작하기
        </button>
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            fontSize: 12.5,
            color: "var(--c-ink-3)",
          }}
        >
          로그인은 이름을 적은 후에 묻습니다
        </div>
      </div>
    </main>
  );
}
