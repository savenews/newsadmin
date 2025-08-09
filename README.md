# SaveNews Admin Dashboard

SaveNews 플랫폼의 관리자 대시보드 애플리케이션입니다.

## 기능

### 핵심 기능
- **뉴스 관리**: 뉴스 작성, 수정, 삭제 및 카테고리/태그 관리
- **리포트 관리**: PDF 업로드를 포함한 리포트 콘텐츠 관리
- **회원 관리**: 사용자 정보 조회 및 관리
- **캘린더 관리**: 이벤트 일정 생성 및 관리
- **커뮤니티 관리**: 사용자 게시글 모니터링 및 관리
- **태그/티커 관리**: 일반 태그 및 기업 티커 심볼 관리

### 특별 기능
- **자동 저장**: 모든 폼 데이터 자동 저장 및 복원
- **데이터 보호**: 작성 중인 내용 임시 저장 및 복원
- **리치 텍스트 에디터**: Quill 기반 WYSIWYG 에디터
- **반응형 디자인**: 모바일 및 데스크톱 지원

## 기술 스택

- **Frontend**: React 18 + TypeScript
- **상태 관리**: React Query (TanStack Query)
- **스타일링**: CSS-in-JS (Inline Styles)
- **에디터**: Quill Rich Text Editor
- **빌드 도구**: Create React App

## 설치 및 실행

### 요구사항
- Node.js 14.0 이상
- npm 또는 yarn

### 설치
```bash
git clone https://github.com/savenews/newsadmin.git
cd newsadmin
npm install
```

### 개발 서버 실행
```bash
npm start
```
애플리케이션이 http://localhost:8082 에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```

## 환경 설정

`.env` 파일에서 다음 설정을 변경할 수 있습니다:
```
PORT=8082
REACT_APP_API_BASE_URL=https://api.saveticker.com
```

## API 연동

이 애플리케이션은 SaveNews API와 통신합니다:
- Base URL: `https://api.saveticker.com`
- 인증: JWT Bearer Token
- API 문서는 백엔드 저장소를 참조하세요

## 프로젝트 구조

```
newsadmin/
├── src/
│   ├── Admin.tsx       # 메인 관리자 컴포넌트 (단일 파일 아키텍처)
│   ├── index.tsx       # React 앱 진입점
│   └── utils/
│       └── adminApi.ts # API 통신 유틸리티
├── public/
│   └── index.html      # HTML 템플릿
├── package.json        # 프로젝트 설정
├── tsconfig.json       # TypeScript 설정
└── .env                # 환경변수
```

## 아키텍처 특징

### 단일 파일 아키텍처
빠른 개발과 유지보수를 위해 모든 관리 기능이 `Admin.tsx` 파일에 구현되어 있습니다. 이는 의도적인 설계 결정으로:
- 빠른 프로토타이핑 가능
- 컴포넌트 간 상태 공유 용이
- 단순한 디버깅과 유지보수

### 데이터 보호 시스템
- 모든 폼 입력이 자동으로 localStorage에 저장
- 브라우저 새로고침이나 실수로 창을 닫아도 데이터 보존
- 24시간 동안 임시 저장 데이터 유지

## 보안

- JWT 토큰 기반 인증
- 401 에러 시 자동 로그아웃
- API 요청에 Bearer Token 자동 포함
- 민감한 정보는 localStorage에 저장하지 않음

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 SaveNews의 독점 소프트웨어입니다.

## 문의

SaveNews 개발팀 - [https://saveticker.com](https://saveticker.com)

프로젝트 링크: [https://github.com/savenews/newsadmin](https://github.com/savenews/newsadmin)