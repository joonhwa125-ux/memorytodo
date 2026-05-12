// 방문자별 데이터 격리.
//
// 인증 없는 데모 단계에서 각 브라우저(사용자)가 서로의 데이터를 보지 못하도록
// localStorage 에 랜덤 UUID 를 한 번 생성·저장하고, 이후 모든 API 호출에
// X-User-Id 헤더로 전달한다.
//
// 보안 메모:
//   - UUID 는 비밀이 아니며 단지 식별자. 추측 어려운 길이의 무작위 값일 뿐.
//   - 같은 UUID 를 가진 사람은 같은 데이터를 봄 (의도된 동작).
//   - 본격 인증 도입 시 이 모듈은 제거되고 실제 로그인된 user_id 로 대체.

const STORAGE_KEY = "memorytodo:userId";

function generateUuid(): string {
  // crypto.randomUUID 가 모든 모던 브라우저에 있음
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // fallback (구형 브라우저)
  return "user-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

let cached: string | null = null;

/**
 * 이 브라우저의 사용자 식별자. 최초 호출 시 생성·저장, 이후엔 같은 값 반환.
 */
export function getUserId(): string {
  if (cached) return cached;

  // SSR / 비-브라우저 환경 가드
  if (typeof window === "undefined" || !window.localStorage) {
    return "anonymous";
  }

  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = generateUuid();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    cached = id;
    return id;
  } catch {
    // private mode 등 localStorage 차단 환경
    return "anonymous";
  }
}
