# Deployment Guide

배포 구성:
- **MongoDB Atlas** (free M0) — 데이터베이스
- **Render** (free web service) — Express backend
- **Vercel** (hobby) — Vite React frontend

---

## 1. MongoDB Atlas

1. https://cloud.mongodb.com 가입 (Google SSO 가능)
2. Cluster 생성: **M0 Sandbox (Free)**, Region: `AWS / Seoul (ap-northeast-2)`
3. **Database Access** → Add New User
   - Username: `memory-app`
   - Autogenerate Password (즉시 복사, 비밀번호 매니저에 저장)
   - Built-in Role: `Read and write to any database`
4. **Network Access** → Add IP Address → `0.0.0.0/0` (Render outbound IP가 동적)
5. **Database** → Connect → **Drivers** (Node.js, 5.5+) → connection string 복사
6. 두 곳 수정:
   - `<db_password>` → 실제 비밀번호
   - `.mongodb.net/?` → `.mongodb.net/halilapp?`

---

## 2. Render — Backend

1. https://render.com 가입 (GitHub SSO)
2. **New +** → **Web Service** → GitHub 리포 (`memorytodo`) 연결
3. 설정:
   - **Name**: `memory-backend` (URL의 prefix가 됨)
   - **Region**: Singapore 또는 Oregon
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Instance Type**: Free
4. **Environment Variables**:
   - `MONGO_URI` = (Atlas connection string with `/halilapp`)
   - `ALLOWED_ORIGINS` = (Vercel URL — Phase 4 이후에 채움; 일단 비워두거나 `*` 임시)
5. **Create Web Service** → 첫 빌드 ~3분
6. 배포 후 URL 확인: `https://memory-backend-xxxx.onrender.com`
7. `/api/health` 호출해서 `{"ok":true}` 확인

> **Free Tier 주의**: 15분간 요청 없으면 sleep. 첫 요청 시 ~30초 콜드 스타트.

---

## 3. Vercel — Frontend

1. https://vercel.com 가입 (GitHub SSO)
2. **Add New** → **Project** → GitHub 리포 import
3. Framework Preset: **Vite** (자동 감지)
   - Build Command: `npm run build` (기본)
   - Output Directory: `dist` (기본)
4. **Environment Variables**:
   - `VITE_API_BASE_URL` = (Render 배포 URL, 끝에 `/` 없이)
5. **Deploy** → ~1분
6. 배포 URL 확인: `https://memorytodo.vercel.app` (또는 random suffix)

---

## 4. CORS 마무리

Vercel URL 손에 들어왔으면 Render로 돌아가서:

1. Service → **Environment** 탭
2. `ALLOWED_ORIGINS` = `https://<your-project>.vercel.app`
3. **Save Changes** → Render가 자동 재배포

---

## 5. 검증

배포된 Vercel URL 접속:
1. `/setup` 에서 이름 입력 → `/intents` 진입
2. `+ 할 일 추가` → 폼 작성 → 저장
3. 목록에 보이는지 확인
4. 수정 / 삭제 동작 확인
5. Atlas Compass 또는 Atlas Dashboard에서 `halilapp.people`, `halilapp.intents` 컬렉션에 실제 데이터 들어갔는지 확인

---

## 6. 비밀번호 회전 (옵션, 권장)

배포 중 비밀번호가 어디든 노출됐다고 의심되면:

1. Atlas → Database Access → `memory-app` → **Edit Password** → Auto-generate
2. 새 비밀번호 복사
3. Render Environment Variables → `MONGO_URI` 의 비밀번호 부분만 교체 → Save
4. Render 자동 재배포 (~1분)
5. 로컬 `.env.local` 의 비밀번호도 교체 (선택 — 로컬 dev 계속 쓸 경우)
