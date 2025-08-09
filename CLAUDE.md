# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## GitHub Repository Information

### Git 설정 정보
- **GitHub Repository URL**: https://github.com/savenews/newsadmin
- **GitHub Username**: savenews
- **GitHub Token**: [환경변수 또는 별도 보안 파일에 저장]
- **Default Branch**: main
- **Remote Name**: origin

### Git 명령어 (다음에 바로 사용 가능)
```bash
# Remote는 이미 토큰과 함께 설정되어 있음
# 현재 remote 확인: git remote -v

# 변경사항 커밋 및 푸시
git add .
git commit -m "커밋 메시지"
git push origin main

# 또는 한 번에
git add . && git commit -m "커밋 메시지" && git push

# 토큰을 새로 설정해야 할 경우 (사용자가 제공 시)
git remote set-url origin https://[TOKEN]@github.com/savenews/newsadmin.git
```

### 주의사항
- GitHub 토큰은 보안상 이 파일에 직접 저장하지 않음
- Remote는 이미 인증 정보와 함께 설정되어 있어 바로 push 가능
- 새로운 기능 추가 후 항상 커밋 메시지에 변경 내용 명확히 기록
- 토큰이 필요한 경우 사용자가 직접 제공해야 함

## Project Overview

This is a React-based admin dashboard for the SaveNews platform. The entire admin interface is implemented in a single TSX file for rapid development and easy maintenance.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8082)
npm start

# Build for production
npm build

# Run tests
npm test
```

## Architecture

### Single-File Architecture
The entire admin interface is contained in `src/Admin.tsx` - a deliberate design decision for rapid development. All components, state management, and UI logic are in this single file.

### API Communication
All API calls are centralized in `src/utils/adminApi.ts`:
- Base URL: `https://api.saveticker.com`
- Authentication: Bearer token stored in localStorage
- Auto-logout on 401 errors
- Separate endpoints for admin operations (`/admin-api/`) vs public operations (`/api/`)

### Key Features
1. **Authentication**: Login with existing SaveNews API credentials
2. **News Management**: CRUD operations with rich text editor (Quill)
3. **Report Management**: PDF uploads and content management
4. **User Management**: View and manage platform users
5. **Calendar Management**: Event scheduling with date/time management
6. **Community Management**: Monitor and moderate user-generated content

## Project Structure

```
/var/www/newsadmin/
├── src/
│   ├── Admin.tsx      # 모든 관리 기능이 포함된 단일 컴포넌트
│   ├── index.tsx      # React 앱 진입점
│   └── utils/
│       └── adminApi.ts # API 통신 유틸리티
├── public/
│   └── index.html     # HTML 템플릿
├── package.json       # 프로젝트 설정
├── tsconfig.json      # TypeScript 설정
├── .env              # 환경변수 (PORT=8082)
└── .gitignore        # Git 무시 파일
```

## 구현된 기능

### 1. 어드민 로그인
- 기존 SaveNews API의 `/api/auth/login` 엔드포인트 사용
- 로그인 성공 시 토큰을 localStorage에 저장
- 401 에러 시 자동 로그아웃

### 2. 뉴스 올리기
- 뉴스 목록 조회 (페이지네이션 지원)
- 뉴스 추가/수정/삭제
- 카테고리: Stock, Bond, Currency, Fund, Real, Crypto
- 태그, 썸네일, 출처 관리

### 3. 리포트 올리기
- 리포트 목록 조회 (페이지네이션 지원)
- 리포트 추가/수정/삭제
- PDF URL 관리
- 태그 관리

### 4. 회원관리
- 회원 목록 조회 (페이지네이션 지원)
- 회원 삭제
- 활성/비활성 상태 표시

### 5. 캘린더 관리
- 이벤트 목록 조회 (페이지네이션 지원)
- 이벤트 추가/수정/삭제
- 날짜, 시간, 위치, 카테고리 관리

### 6. 커뮤니티 관리
- 커뮤니티 게시글 목록 조회 (페이지네이션 지원)
- 게시글 삭제
- 조회수, 댓글 수 표시

## 실행 방법

```bash
cd /var/www/newsadmin
npm install
npm start
```

어드민 페이지는 http://localhost:8082 에서 접속 가능합니다.

## API 엔드포인트

모든 API는 `https://api.saveticker.com` 베이스 URL을 사용합니다.

### 인증
- `POST /api/auth/login` - 어드민 로그인

### 뉴스 관리
- `GET /api/news` - 뉴스 목록 조회
- `POST /api/news` - 뉴스 생성
- `PUT /api/news/:id` - 뉴스 수정
- `DELETE /api/news/:id` - 뉴스 삭제

### 리포트 관리
- `GET /api/reports` - 리포트 목록 조회
- `POST /api/reports` - 리포트 생성
- `PUT /api/reports/:id` - 리포트 수정
- `DELETE /api/reports/:id` - 리포트 삭제

### 회원 관리
- `GET /api/users` - 회원 목록 조회
- `PUT /api/users/:id` - 회원 정보 수정
- `DELETE /api/users/:id` - 회원 삭제

### 캘린더 관리
- `GET /api/calendar` - 일정 목록 조회
- `POST /api/calendar` - 일정 생성
- `PUT /api/calendar/:id` - 일정 수정
- `DELETE /api/calendar/:id` - 일정 삭제

### 커뮤니티 관리
- `GET /api/community` - 게시글 목록 조회
- `DELETE /api/community/:id` - 게시글 삭제
- `GET /api/community/:id/comments` - 댓글 조회
- `DELETE /api/community/:id/comments/:commentId` - 댓글 삭제

## Key Design Principles

1. **Single File Structure**: All admin pages are implemented in `Admin.tsx` for rapid development and maintenance.

2. **Minimal Dependencies**: Uses only essential libraries - React, React Query, and Quill for rich text editing.

3. **Inline Styles**: CSS-in-JS approach with inline style objects to maintain the single-file architecture.

4. **Type Safety**: TypeScript with minimal but sufficient type definitions for quick development.

5. **Content Structure**: All content (news, reports, calendar, community) uses a unified structure with text and image blocks.

## Important Implementation Details

### Authentication Flow
- Login credentials are sent to `/api/auth/login`
- Access token stored in `localStorage` as `access_token`
- All authenticated requests include `Authorization: Bearer {token}` header
- Automatic logout and redirect on 401 responses

### Content Format
All content entities use the same structure:
```typescript
type Content = Array<
  | { type: 'text'; content: string }
  | { type: 'image'; content: string; url: string; alt?: string }
>
```

### File Uploads
- Images: `/api/uploads/image` (public endpoint)
- Documents: `/admin-api/uploads/document` (admin endpoint)
- Both return `{ url: string }` on success

### Date Handling
- Calendar API expects ISO 8601 format with timezone
- Frontend converts YYYY-MM-DD to full ISO format before API calls

## Common Tasks

### Adding New Features
1. Add the new section to the navigation in `Admin.tsx`
2. Create the component within the same file
3. Add API functions to `adminApi.ts` if needed
4. Follow the existing pattern of list/create/edit/delete operations

### Debugging API Issues
- Check browser console for detailed error messages
- Verify token in localStorage Developer Tools
- API base URL is hardcoded in `adminApi.ts`

### Deployment
- Build with `npm run build`
- Deploy the `build/` directory to your web server
- Ensure the server serves `index.html` for all routes (SPA requirement)