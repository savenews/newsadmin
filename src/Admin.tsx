import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as api from "./utils/adminApi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// API Base URL 확인
const API_BASE_URL = api.getApiBaseUrl();
console.log("API Base URL:", API_BASE_URL);

// SaveNews 브랜드 컬러
const colors = {
  primary: "#7B2FFF",
  primaryDark: "#6A1FEE",
  secondary: "#FF6B35",
  background: "#F5F5F5",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  green: {
    100: "#D1FAE5",
    600: "#059669",
  },
  blue: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
  },
  purple: {
    500: "#8B5CF6",
    600: "#7C3AED",
  },
  orange: {
    600: "#EA580C",
  },
  indigo: {
    600: "#4F46E5",
  },
  red: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
  },
  info: "#3B82F6",
};

// 반응형 스타일
const styles = {
  // 기본 레이아웃
  container: {
    minHeight: "100vh",
    backgroundColor: colors.background,
  },

  // 로그인 페이지
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: colors.background,
    padding: "20px",
  },
  loginBox: {
    backgroundColor: colors.white,
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "400px",
  },
  loginLogo: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  loginLogoText: {
    fontSize: "32px",
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: "-1px",
  },
  loginSubtitle: {
    fontSize: "14px",
    color: colors.gray[500],
    marginTop: "8px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.gray[700],
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    backgroundColor: colors.white,
    transition: "all 0.2s",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  inputFocus: {
    border: `1px solid ${colors.primary}`,
    boxShadow: `0 0 0 3px ${colors.primary}20`,
  },
  inputError: {
    border: `1px solid ${colors.error}`,
  },
  button: {
    width: "100%",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "600",
    color: colors.white,
    backgroundColor: colors.primary,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  },
  buttonHover: {
    backgroundColor: colors.primaryDark,
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(123, 47, 255, 0.3)",
  },
  buttonDisabled: {
    backgroundColor: colors.gray[300],
    cursor: "not-allowed",
  },
  errorMessage: {
    color: colors.error,
    fontSize: "14px",
    marginTop: "8px",
    marginBottom: "16px",
    textAlign: "center" as const,
  },

  // 헤더
  header: {
    backgroundColor: colors.white,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: "-0.5px",
  },
  nav: {
    display: "flex",
    gap: "8px",
    overflowX: "auto" as const,
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
    WebkitScrollbar: { display: "none" },
  },
  navItem: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.gray[600],
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
  },
  navItemActive: {
    color: colors.white,
    backgroundColor: colors.primary,
  },
  navItemHover: {
    backgroundColor: colors.gray[100],
    color: colors.gray[800],
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "500",
    color: colors.gray[700],
  },
  logoutButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.white,
    backgroundColor: colors.error,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // 콘텐츠 영역
  content: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: colors.gray[900],
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: colors.white,
    backgroundColor: colors.success,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },

  // 테이블
  tableContainer: {
    backgroundColor: colors.white,
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto" as const,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    minWidth: "600px",
  },
  th: {
    padding: "16px",
    textAlign: "left" as const,
    fontSize: "12px",
    fontWeight: "600",
    color: colors.gray[600],
    backgroundColor: colors.gray[50],
    borderBottom: `1px solid ${colors.gray[200]}`,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: colors.gray[800],
    borderBottom: `1px solid ${colors.gray[100]}`,
  },
  tableRow: {
    transition: "background-color 0.2s",
  },
  tableRowHover: {
    backgroundColor: colors.gray[50],
  },

  // 액션 버튼
  actionButtons: {
    display: "flex",
    gap: "4px",
    justifyContent: "center",
    flexWrap: "nowrap" as const,
  },
  actionButton: {
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: "500",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
    minWidth: "40px",
  },
  editButton: {
    color: colors.white,
    backgroundColor: colors.info,
  },
  deleteButton: {
    color: colors.white,
    backgroundColor: colors.error,
  },

  // 페이지네이션
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "24px",
  },
  pageButton: {
    minWidth: "40px",
    height: "40px",
    padding: "0 12px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.gray[700],
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageButtonActive: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pageButtonDisabled: {
    color: colors.gray[400],
    cursor: "not-allowed",
  },
  paginationButton: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.gray[700],
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  paginationButtonDisabled: {
    color: colors.gray[400],
    backgroundColor: colors.gray[100],
    cursor: "not-allowed",
  },
  paginationInfo: {
    fontSize: "14px",
    color: colors.gray[600],
    fontWeight: "500",
  },
  loadingMessage: {
    textAlign: "center" as const,
    padding: "32px",
    color: colors.gray[600],
    fontSize: "14px",
  },
  filterSelect: {
    padding: "10px 12px",
    fontSize: "14px",
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    backgroundColor: colors.white,
    cursor: "pointer",
    outline: "none",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontWeight: "600",
    color: colors.gray[700],
    backgroundColor: colors.gray[50],
    borderBottom: `1px solid ${colors.gray[200]}`,
    fontSize: "14px",
  },
  tableCell: {
    padding: "12px 16px",
    borderBottom: `1px solid ${colors.gray[100]}`,
    fontSize: "14px",
    color: colors.gray[700],
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap" as const,
  },
  noData: {
    textAlign: "center" as const,
    padding: "48px",
    color: colors.gray[500],
    fontSize: "14px",
  },

  // 모달
  modal: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    animation: "slideUp 0.3s ease-out",
  },
  modalHeader: {
    padding: "24px",
    borderBottom: `1px solid ${colors.gray[200]}`,
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: colors.gray[900],
  },
  modalBody: {
    padding: "24px",
    flex: 1,
    minHeight: "200px",
  },
  modalFooter: {
    padding: "24px",
    borderTop: `1px solid ${colors.gray[200]}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },

  // 폼 요소
  textarea: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    backgroundColor: colors.white,
    transition: "all 0.2s",
    outline: "none",
    resize: "vertical" as const,
    minHeight: "120px",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "16px",
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    backgroundColor: colors.white,
    transition: "all 0.2s",
    outline: "none",
    cursor: "pointer",
    boxSizing: "border-box" as const,
  },

  // 유틸리티
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: `3px solid ${colors.gray[200]}`,
    borderTop: `3px solid ${colors.primary}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    backgroundColor: colors.error,
    color: colors.white,
    padding: "16px 24px",
    borderRadius: "8px",
    textAlign: "center" as const,
    margin: "24px 0",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "48px 24px",
    color: colors.gray[500],
  },
  emptyStateIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.3,
  },
  emptyStateText: {
    fontSize: "16px",
    marginBottom: "24px",
  },

  // 반응형 헬퍼
  mobileOnly: {
    display: "none",
  },
  desktopOnly: {
    display: "block",
  },

  // 검색 관련 스타일
  searchContainer: {
    padding: "24px",
    backgroundColor: colors.white,
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  searchInput: {
    padding: "12px 16px",
    fontSize: "14px",
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    backgroundColor: colors.white,
    transition: "all 0.2s",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  searchButton: {
    padding: "12px 32px",
    fontSize: "14px",
    fontWeight: "600",
    color: colors.white,
    backgroundColor: colors.primary,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
    whiteSpace: "nowrap" as const,
  },

  // 모달 관련 스타일
  modalCloseButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: colors.gray[400],
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "all 0.2s",
  },

  // 상세 정보 관련 스타일
  detailSection: {
    marginBottom: "24px",
  },
  detailSectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: "12px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    color: colors.gray[500],
    fontWeight: "500",
  },
  detailValue: {
    fontSize: "14px",
    color: colors.gray[800],
  },

  // 버튼 스타일
  cancelButton: {
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.gray[700],
    backgroundColor: colors.gray[100],
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  },
  submitButton: {
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "500",
    color: colors.white,
    backgroundColor: colors.primary,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  },
};

// CSS 애니메이션 추가
const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${colors.gray[100]};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.gray[400]};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.gray[500]};
  }
  
  @media (max-width: 767px) {
    .mobile-scroll {
      -webkit-overflow-scrolling: touch;
    }
    .mobile-only {
      display: block !important;
    }
    .desktop-only {
      display: none !important;
    }
  }
  
  @media (min-width: 768px) {
    .mobile-only {
      display: none !important;
    }
    .desktop-only {
      display: block !important;
    }
  }
  
  /* Quill Editor Styles */
  .rich-editor-container {
    background: #fff;
    border-radius: 8px;
  }
  
  .rich-editor-container .quill {
    border: 1px solid ${colors.gray[200]};
    border-radius: 8px;
    overflow: hidden;
  }
  
  .rich-editor-container .ql-toolbar {
    background: ${colors.gray[50]};
    border: none;
    border-bottom: 1px solid ${colors.gray[200]};
    border-radius: 8px 8px 0 0;
  }
  
  .rich-editor-container .ql-container {
    border: none;
    font-size: 15px;
    line-height: 1.6;
  }
  
  .rich-editor-container .ql-editor {
    min-height: 250px;
    padding: 16px;
  }
  
  .rich-editor-container .ql-editor.ql-blank::before {
    font-style: normal;
    color: ${colors.gray[400]};
  }
  
  .rich-editor-container .ql-toolbar button:hover {
    background: ${colors.primary}20;
  }
  
  .rich-editor-container .ql-toolbar button.ql-active {
    background: ${colors.primary}30;
    color: ${colors.primary};
  }
  
  .rich-editor-container .ql-snow .ql-stroke {
    stroke: ${colors.gray[600]};
  }
  
  .rich-editor-container .ql-snow .ql-fill {
    fill: ${colors.gray[600]};
  }
  
  .rich-editor-container .ql-toolbar.ql-snow .ql-stroke.ql-active {
    stroke: ${colors.primary};
  }
  
  .rich-editor-container .ql-toolbar.ql-snow .ql-fill.ql-active {
    fill: ${colors.primary};
  }
  
  /* Quill Editor Image Styles */
  .rich-editor-container .ql-editor img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5;
    min-height: 100px;
  }
  
  .rich-editor-container .ql-editor img.ql-img-error {
    border: 2px dashed #ef4444;
    padding: 20px;
    text-align: center;
    color: #ef4444;
  }
  
  .rich-editor-container .ql-editor img.ql-img-error::after {
    content: "이미지 로드 실패";
    display: block;
    margin-top: 10px;
    font-size: 14px;
  }
  
  .rich-editor-container .ql-editor p {
    margin-bottom: 16px;
  }
  
  .rich-editor-container .ql-editor h1,
  .rich-editor-container .ql-editor h2,
  .rich-editor-container .ql-editor h3 {
    margin-top: 24px;
    margin-bottom: 12px;
    font-weight: 600;
  }
`;

// 글로벌 스타일 주입
if (
  typeof document !== "undefined" &&
  !document.getElementById("admin-global-styles")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "admin-global-styles";
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

// Loading Spinner Component
const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = "데이터를 불러오는 중...",
}) => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner} />
    <p style={{ marginTop: "16px", color: colors.gray[600], fontSize: "14px" }}>
      {message}
    </p>
  </div>
);

// Empty State Component
const EmptyState: React.FC<{
  message: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ message, icon = "📋", actionText, onAction }) => (
  <div style={styles.emptyState}>
    {icon && <div style={styles.emptyStateIcon}>{icon}</div>}
    <div style={styles.emptyStateText}>{message}</div>
    {actionText && onAction && (
      <button
        onClick={onAction}
        style={{
          marginTop: "16px",
          padding: "10px 20px",
          backgroundColor: colors.primary,
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {actionText}
      </button>
    )}
  </div>
);

// Login Component
const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login(email, password);

      // role 체크 - response.user_info에 role이 있음
      const userRole = response.user_info?.role;

      if (!userRole || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
        setError("관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.user_info));
      onLogin();
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <div style={styles.loginLogo}>
          <div style={styles.loginLogoText}>SAVENEWS</div>
          <div style={styles.loginSubtitle}>Admin Dashboard</div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.formGroup}>
            <label style={styles.label}>이메일</label>
            <input
              type="email"
              placeholder="admin@savenews.com"
              style={{
                ...styles.input,
                ...(focusedField === "email" ? styles.inputFocus : {}),
                ...(error && !email ? styles.inputError : {}),
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              disabled={isLoading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focusedField === "password" ? styles.inputFocus : {}),
                ...(error && !password ? styles.inputError : {}),
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              disabled={isLoading}
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Rich Editor Component
interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);

    // Suppress findDOMNode warning for ReactQuill
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("findDOMNode")) {
        return;
      }
      originalError.call(console, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // 이미지 에러 핸들링
  useEffect(() => {
    if (isReady && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const container = editor.container;

      // 이미지 URL 변환 함수
      const fixImageUrl = (url: string): string => {
        if (!url) return url;

        // 이미 전체 URL인 경우 API_BASE_URL을 포함하고 있는지 확인
        if (url.startsWith("http")) {
          // 잘못된 포트(8082)를 포함하고 있는 경우 수정
          if (url.includes(":8082")) {
            const urlParts = url.split("/api/");
            if (urlParts.length > 1) {
              return `${API_BASE_URL}/api/${urlParts[1]}`;
            }
          }
          return url;
        }

        // 상대 경로인 경우
        if (!url.startsWith("/")) {
          url = "/" + url;
        }
        return `${API_BASE_URL}${url}`;
      };

      // 기존 이미지들의 URL 수정
      const images = container.querySelectorAll("img");
      images.forEach((img: HTMLImageElement) => {
        const fixedUrl = fixImageUrl(img.src);
        if (img.src !== fixedUrl) {
          console.log("이미지 URL 수정:", img.src, "->", fixedUrl);
          img.src = fixedUrl;
        }
      });

      // 이미지 로드 에러 이벤트 리스너
      const handleImageError = (e: Event) => {
        const target = e.target as HTMLImageElement;
        if (target.tagName === "IMG") {
          console.error("이미지 로드 실패:", target.src);

          // URL 수정 시도
          const fixedUrl = fixImageUrl(target.src);
          if (target.src !== fixedUrl) {
            console.log("이미지 URL 재시도:", fixedUrl);
            target.src = fixedUrl;
          } else {
            target.classList.add("ql-img-error");
            target.alt = `이미지 로드 실패: ${target.src}`;
          }
        }
      };

      // 이미지 로드 성공 이벤트 리스너
      const handleImageLoad = (e: Event) => {
        const target = e.target as HTMLImageElement;
        if (target.tagName === "IMG") {
          console.log("이미지 로드 성공:", target.src);
          target.classList.remove("ql-img-error");
        }
      };

      // DOM 변경 감지를 위한 MutationObserver
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Element node
              const element = node as HTMLElement;
              if (element.tagName === "IMG") {
                const img = element as HTMLImageElement;
                const fixedUrl = fixImageUrl(img.src);
                if (img.src !== fixedUrl) {
                  console.log("새 이미지 URL 수정:", img.src, "->", fixedUrl);
                  img.src = fixedUrl;
                }
              }
              // 자식 요소의 이미지도 확인
              const childImages = element.querySelectorAll("img");
              childImages.forEach((img: HTMLImageElement) => {
                const fixedUrl = fixImageUrl(img.src);
                if (img.src !== fixedUrl) {
                  console.log("자식 이미지 URL 수정:", img.src, "->", fixedUrl);
                  img.src = fixedUrl;
                }
              });
            }
          });
        });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
      });

      container.addEventListener("error", handleImageError, true);
      container.addEventListener("load", handleImageLoad, true);

      return () => {
        observer.disconnect();
        container.removeEventListener("error", handleImageError, true);
        container.removeEventListener("load", handleImageLoad, true);
      };
    }
  }, [isReady]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          console.log("이미지 업로드 시작:", file.name, file.type, file.size);

          // Show loading state
          const range = quillRef.current?.getEditor().getSelection();
          if (range) {
            quillRef.current
              ?.getEditor()
              .insertText(range.index, "이미지 업로드 중...");
          }

          // Upload image
          const uploadedData = await api.uploadImage(file);
          console.log("업로드 응답:", uploadedData);

          // Remove loading text and insert image
          if (range) {
            quillRef.current
              ?.getEditor()
              .deleteText(range.index, "이미지 업로드 중...".length);

            // API may return different field names: file_url, url, or image_url
            const imageUrl =
              uploadedData.file_url ||
              uploadedData.url ||
              uploadedData.image_url;
            if (!imageUrl) {
              console.error("업로드 응답 전체:", uploadedData);
              throw new Error(
                "업로드 응답에 이미지 URL이 없습니다. 응답: " +
                  JSON.stringify(uploadedData),
              );
            }

            // Convert relative URL to absolute URL
            const absoluteUrl = imageUrl.startsWith("http")
              ? imageUrl
              : `${API_BASE_URL}${imageUrl}`;

            console.log("이미지 URL:", absoluteUrl);
            quillRef.current
              ?.getEditor()
              .insertEmbed(range.index, "image", absoluteUrl);
          }
        } catch (error: any) {
          // Remove loading text on error
          const range = quillRef.current?.getEditor().getSelection();
          if (range) {
            const editor = quillRef.current?.getEditor();
            if (editor) {
              const text = editor.getText(
                range.index,
                "이미지 업로드 중...".length,
              );
              if (text === "이미지 업로드 중...") {
                editor.deleteText(range.index, "이미지 업로드 중...".length);
              }
            }
          }

          console.error("이미지 업로드 에러:", error);
          alert(
            `이미지 업로드에 실패했습니다: ${
              error.message || "알 수 없는 오류"
            }`,
          );
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [],
  );

  const formats = ["header", "list", "bullet", "link", "image"];

  if (!isReady) {
    return (
      <div
        style={{ height: "350px", background: "#f5f5f5", borderRadius: "8px" }}
      />
    );
  }

  // 커스텀 onChange 핸들러
  const handleChange = (content: string) => {
    // HTML 내용을 파싱하여 이미지 URL 수정
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = doc.querySelectorAll("img");

    let modified = false;
    images.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        let fixedUrl = src;

        // 잘못된 포트(8082)를 포함하고 있는 경우 수정
        if (src.includes(":8082")) {
          const urlParts = src.split("/api/");
          if (urlParts.length > 1) {
            fixedUrl = `${API_BASE_URL}/api/${urlParts[1]}`;
            img.setAttribute("src", fixedUrl);
            modified = true;
            console.log("onChange에서 이미지 URL 수정:", src, "->", fixedUrl);
          }
        }
        // 상대 경로인 경우
        else if (!src.startsWith("http")) {
          if (!src.startsWith("/")) {
            fixedUrl = "/" + src;
          }
          fixedUrl = `${API_BASE_URL}${fixedUrl}`;
          img.setAttribute("src", fixedUrl);
          modified = true;
          console.log(
            "onChange에서 상대 경로 이미지 URL 수정:",
            src,
            "->",
            fixedUrl,
          );
        }
      }
    });

    if (modified) {
      onChange(doc.body.innerHTML);
    } else {
      onChange(content);
    }
  };

  return (
    <div className="rich-editor-container" ref={containerRef}>
      <ReactQuill
        ref={(el) => {
          if (el) {
            quillRef.current = el;
          }
        }}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: "500px", marginBottom: "50px" }}
      />
    </div>
  );
};

const convertHtmlToContentBlocks = (html: string): api.NewsContent[] => {
  if (!html || html === "<p><br></p>") {
    return [{ type: "text", content: "\n" }];
  }
  if (html) {
    const cleaned = html.replace(/\s|&nbsp;/gi, "");
    const onlyEmptyParas = /^(?:<p><br\s*\/?><\/p>)+$/i.test(cleaned);
    if (onlyEmptyParas) {
      const count = (cleaned.match(/<p><br\s*\/?><\/p>/gi) || []).length;
      return Array.from({ length: count }, () => ({
        type: "text",
        content: "\n",
      }));
    }
  }
  if (
    !html ||
    html.trim() === "" ||
    /^(<p><br\s*\/?><\/p>)$/i.test(html.trim())
  ) {
    return [{ type: "text", content: "" }];
  }

  console.log("Converting HTML to content blocks:", html);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const blocks: api.NewsContent[] = [];

  // 모든 직접 자식 요소들을 순회
  tempDiv.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      // P 태그나 DIV 태그 처리
      if (["P", "DIV"].includes(element.tagName)) {
        const inner = element.innerHTML;
        const isOnlyBrPara =
          element.tagName === "P" &&
          /^(\s|&nbsp;|<br\s*\/?>)*$/i.test(inner) &&
          element.querySelectorAll("br").length > 0;

        if (isOnlyBrPara) {
          blocks.push({ type: "text", content: "\n" });
          return; // ⬅️ 이 요소는 처리 끝
        }
        // 이미지를 포함하는지 확인
        const images = element.querySelectorAll("img");

        if (images.length > 0) {
          // 이미지가 있는 경우
          let lastProcessedIndex = 0;
          const htmlContent = element.innerHTML;

          images.forEach((img) => {
            const imgElement = img as HTMLImageElement;
            const imgOuterHTML = imgElement.outerHTML;
            const imgIndex = htmlContent.indexOf(imgOuterHTML);

            // 이미지 앞의 텍스트 처리
            if (imgIndex > lastProcessedIndex) {
              const textBefore = htmlContent.substring(
                lastProcessedIndex,
                imgIndex,
              );
              const tempSpan = document.createElement("span");
              tempSpan.innerHTML = textBefore;
              const text = tempSpan.textContent?.trim();
              if (text) {
                blocks.push({ type: "text", content: text });
              }
            }

            // 이미지 처리
            let imageUrl = imgElement.src;
            if (imageUrl.startsWith(API_BASE_URL)) {
              imageUrl = imageUrl.replace(API_BASE_URL, "");
            }

            console.log("Processing image:", imageUrl);

            blocks.push({
              type: "image",
              url: imageUrl,
              alt: imgElement.alt || null,
            } as api.NewsContent);

            lastProcessedIndex = imgIndex + imgOuterHTML.length;
          });

          // 마지막 이미지 뒤의 텍스트 처리
          if (lastProcessedIndex < htmlContent.length) {
            const textAfter = htmlContent.substring(lastProcessedIndex);
            const tempSpan = document.createElement("span");
            tempSpan.innerHTML = textAfter;
            const text = tempSpan.textContent?.trim();
            if (text) {
              blocks.push({ type: "text", content: text });
            }
          }
        } else {
          // 텍스트만 있는 경우
          const text = element.textContent?.trim();
          if (text) {
            blocks.push({ type: "text", content: text });
          }
        }
      }
      // 독립적인 IMG 태그
      else if (element.tagName === "IMG") {
        const imgElement = element as HTMLImageElement;
        let imageUrl = imgElement.src;

        if (imageUrl.startsWith(API_BASE_URL)) {
          imageUrl = imageUrl.replace(API_BASE_URL, "");
        }

        console.log("Processing standalone image:", imageUrl);

        blocks.push({
          type: "image",
          url: imageUrl,
          alt: imgElement.alt || null,
        } as api.NewsContent);
      }
      // 기타 블록 요소
      else if (
        ["H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"].includes(
          element.tagName,
        )
      ) {
        const text = element.textContent?.trim();
        if (text) {
          blocks.push({ type: "text", content: text });
        }
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({ type: "text", content: text });
      }
    }
  });

  console.log("Converted content blocks:", blocks);

  return blocks.length > 0 ? blocks : [{ type: "text", content: "" }];
};

const convertContentBlocksToHtml = (blocks: api.NewsContent[]): string => {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  console.log("Converting content blocks to HTML:", blocks);

  return blocks
    .map((block) => {
      if (block.type === "text") {
        // 줄바꿈 처리
        const paragraphs = block.content.split("\n").filter((p) => p.trim());
        if (paragraphs.length > 1) {
          return paragraphs.map((p) => `<p>${p}</p>`).join("");
        }
        return `<p>${block.content}</p>`;
      } else if (block.type === "image") {
        // Convert relative URL to absolute URL for display
        let imageUrl = block.url;

        if (!imageUrl) {
          console.error("Image block has no URL:", block);
          return "";
        }

        // URL 처리 로직 개선
        if (!imageUrl.startsWith("http")) {
          // 상대 경로인 경우
          if (!imageUrl.startsWith("/")) {
            imageUrl = "/" + imageUrl;
          }
          imageUrl = `${API_BASE_URL}${imageUrl}`;
        }

        console.log("Image block:", block);
        console.log("Converted image URL:", imageUrl);

        // Quill 에디터에서 표시하기 위해 P 태그로 감싸기
        return `<p><img src="${imageUrl}" alt="${block.alt || ""}" /></p>`;
      }
      return "";
    })
    .join("");
};

// Tag Input Component with Autocomplete
interface TagInputProps {
  value: string[]; // Array of tag IDs
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = "태그를 입력하세요",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags(),
  });

  // 필수 태그와 선택 태그 분리
  const requiredTags = useMemo(() => {
    return tagsData?.tags?.filter((tag: any) => tag.is_required) || [];
  }, [tagsData]);

  // 디버깅용 로그
  useEffect(() => {
    console.log("TagInput - value (selected tag IDs):", value);
    console.log("TagInput - available tags:", tagsData?.tags);
  }, [value, tagsData]);

  // 필수 태그 자동 추가 제거 - 필수 태그도 선택사항임

  const suggestions = useMemo(() => {
    if (!inputValue || !tagsData?.tags) return [];
    const input = inputValue.toLowerCase();
    return tagsData.tags
      .filter(
        (tag: any) =>
          tag.name.toLowerCase().includes(input) && !value.includes(tag.id),
      )
      .slice(0, 8);
  }, [inputValue, tagsData, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addTag(suggestions[selectedIndex].id);
      } else if (inputValue.trim()) {
        // Try to find the tag by name
        const foundTag = tagsData?.tags?.find(
          (t: any) => t.name.toLowerCase() === inputValue.trim().toLowerCase(),
        );
        if (foundTag) {
          addTag(foundTag.id);
        } else {
          alert("새로운 태그는 먼저 태그 관리에서 추가해주세요.");
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = (tagIdOrName: string) => {
    // Check if it's from suggestions (has ID) or manual input (just name)
    const tagFromSuggestions = tagsData?.tags?.find(
      (t: any) => t.id === tagIdOrName || t.name === tagIdOrName,
    );

    if (tagFromSuggestions) {
      // Use tag ID if found in suggestions
      if (!value.includes(tagFromSuggestions.id)) {
        onChange([...value, tagFromSuggestions.id]);
      }
    } else {
      // For manual input, we need to find or create the tag
      // For now, we'll just alert the user to select from existing tags
      alert("새로운 태그는 먼저 태그 관리에서 추가해주세요.");
    }

    setInputValue("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // 티커와 일반 태그 분리
  const tickers = useMemo(() => {
    return (
      tagsData?.tags?.filter(
        (tag: any) => tag.is_ticker && !value.includes(tag.id),
      ) || []
    );
  }, [tagsData, value]);

  const regularTags = useMemo(() => {
    return (
      tagsData?.tags?.filter(
        (tag: any) => !tag.is_ticker && !value.includes(tag.id),
      ) || []
    );
  }, [tagsData, value]);

  return (
    <div style={{ position: "relative" }}>
      {/* 추천 태그 목록 */}
      {tagsData?.tags && (
        <div style={{ marginBottom: "12px" }}>
          {/* 일반 태그 */}
          <div
            style={{
              fontSize: "12px",
              color: "#6B7280",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            자주 사용하는 태그 (클릭하여 추가)
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            {regularTags.slice(0, 10).map((tag: any) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag.id)}
                style={{
                  padding: "4px 12px",
                  backgroundColor: tag.is_required ? "#FEF3C7" : "#F3F4F6",
                  color: tag.is_required ? "#92400E" : "#374151",
                  border: `1px solid ${
                    tag.is_required ? "#FCD34D" : "#E5E7EB"
                  }`,
                  borderRadius: "16px",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: tag.is_required ? "500" : "400",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {tag.name}
                {tag.is_required && (
                  <span style={{ marginLeft: "4px", fontSize: "11px" }}>*</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "10px",
          border: `2px solid ${showSuggestions ? "#6366F1" : "#E5E7EB"}`,
          borderRadius: "12px",
          backgroundColor: "#FAFAFA",
          minHeight: "52px",
          alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        {value.map((tagId, index) => {
          const tagInfo = tagsData?.tags?.find((t: any) => t.id === tagId);
          if (!tagInfo) return null; // Skip if tag not found

          const isRequired = tagInfo.is_required;
          const isTicker = tagInfo.is_ticker;

          return (
            <span
              key={index}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                backgroundColor: isTicker
                  ? "#3730A3"
                  : isRequired
                  ? "#6366F1"
                  : "#8B5CF6",
                color: colors.white,
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "500",
                animation: "slideIn 0.2s ease-out",
              }}
            >
              {tagInfo.name}
              <button
                type="button"
                onClick={() => removeTag(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.white,
                  cursor: "pointer",
                  padding: "0",
                  fontSize: "16px",
                  lineHeight: 1,
                  opacity: 0.8,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                title="태그를 제거합니다"
              >
                ×
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            // 입력값 정리: 연속된 $를 하나로
            let value = e.target.value.replace(/\$+/g, "$");
            setInputValue(value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          style={{
            flex: 1,
            minWidth: "120px",
            border: "none",
            outline: "none",
            padding: "4px",
            fontSize: "16px",
          }}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "8px",
            backgroundColor: colors.white,
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px rgba(0, 0, 0, 0.08), 0 6px 10px rgba(0, 0, 0, 0.05)",
            zIndex: 1000,
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((tag: any, index: number) => (
            <div
              key={tag.id}
              onClick={() => addTag(tag.id)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                backgroundColor:
                  index === selectedIndex ? "#F3F4F6" : "transparent",
                borderBottom:
                  index < suggestions.length - 1 ? "1px solid #F3F4F6" : "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", color: "#111827" }}>
                    {tag.name}
                  </div>
                  {tag.description && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        marginTop: "2px",
                      }}
                    >
                      {tag.description}
                    </div>
                  )}
                </div>
                {tag.is_required && (
                  <span
                    style={{
                      padding: "2px 8px",
                      backgroundColor: "#FEF3C7",
                      color: "#92400E",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}
                  >
                    필수
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [inputPage, setInputPage] = useState("");

  const handlePageInput = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setInputPage("");
    } else {
      alert(`1부터 ${totalPages}까지의 페이지 번호를 입력해주세요.`);
    }
  };

  // 페이지 번호 생성 로직 개선
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10; // 최대 표시할 페이지 수

    if (totalPages <= maxVisible) {
      // 전체 페이지가 10개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 중심으로 페이지 표시
      let start = Math.max(1, currentPage - 4);
      let end = Math.min(totalPages, start + maxVisible - 1);

      // 끝에 가까운 경우 시작점 조정
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      // 첫 페이지
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      // 중간 페이지들
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 마지막 페이지
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <div style={{ fontSize: "14px", color: "#666" }}>
        전체 {totalPages}페이지 중 {currentPage}페이지
      </div>

      <div style={styles.pagination}>
        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
          }}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>

        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${index}`}
              style={{ padding: "0 10px", color: "#999" }}
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              style={{
                ...styles.pageButton,
                ...(currentPage === pageNum ? styles.pageButtonActive : {}),
              }}
              onClick={() => onPageChange(pageNum as number)}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          style={{
            ...styles.pageButton,
            ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
          }}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>

      <form
        onSubmit={handlePageInput}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="페이지"
          style={{
            padding: "6px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            width: "80px",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 12px",
            backgroundColor: colors.primary,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          이동
        </button>
      </form>
    </div>
  );
};

// Ticker Input Component - 기업 티커 전용 입력 컴포넌트
interface TickerInputProps {
  value: string[]; // Array of ticker tag IDs
  onChange: (tickers: string[]) => void;
  placeholder?: string;
}

const TickerInput: React.FC<TickerInputProps> = ({
  value,
  onChange,
  placeholder = "티커를 입력하세요 (예: NVDA 또는 $NVDA)",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isCreatingTicker, setIsCreatingTicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags(),
  });

  // 티커만 필터링
  const tickerTags = useMemo(() => {
    return tagsData?.tags?.filter((tag: any) => tag.is_ticker) || [];
  }, [tagsData]);

  const suggestions = useMemo(() => {
    if (!inputValue || !tickerTags) return [];
    // 사용자 입력에서 $ 제거하고 검색 (사용자가 $ 없이 입력해도 검색되도록)
    const input = inputValue.toLowerCase().replace(/\$/g, "");
    return tickerTags
      .filter((tag: any) => {
        // 티커 이름에서도 $ 제거하고 비교
        const tagName = tag.name.toLowerCase().replace(/\$/g, "");
        return tagName.includes(input) && !value.includes(tag.id);
      })
      .slice(0, 8);
  }, [inputValue, tickerTags, value]);

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        addTicker(suggestions[selectedIndex].id);
      } else if (inputValue.trim()) {
        // 직접 입력한 티커 처리
        const originalInput = inputValue.trim();
        let input = originalInput.toUpperCase();

        // $ 기호 자동 처리
        // 1. 여러 개의 $가 있으면 하나만 남김
        input = input.replace(/\$+/g, "$");

        // 2. $ 기호가 중간이나 끝에 있으면 맨 앞으로 이동
        if (input.includes("$") && !input.startsWith("$")) {
          input = "$" + input.replace(/\$/g, "");
        }

        // 3. $ 기호가 없으면 자동으로 추가
        const wasAutoAdded = !input.startsWith("$");
        if (wasAutoAdded) {
          input = "$" + input;
        }

        const tickerSymbol = input; // 정리된 티커 심볼 (항상 $ 포함)

        // 이미 존재하는 티커인지 확인
        const existingTicker = tickerTags.find(
          (t: any) => t.name.toUpperCase() === tickerSymbol,
        );

        if (existingTicker) {
          addTicker(existingTicker.id);
        } else {
          // 새 티커 자동 생성
          const displayMessage = wasAutoAdded
            ? `'${originalInput.toUpperCase()}'를 '${tickerSymbol}' 티커로 등록하시겠습니까?\n($ 기호가 자동으로 추가됩니다)`
            : `'${tickerSymbol}' 티커가 존재하지 않습니다. 새로 등록하시겠습니까?`;

          const confirmed = window.confirm(displayMessage);
          if (confirmed) {
            setIsCreatingTicker(true);
            try {
              const newTicker = await api.createTag({
                name: tickerSymbol,
                description: `${tickerSymbol.replace("$", "")} 기업 티커`,
                is_ticker: true,
                is_required: false,
              });

              // 태그 목록 새로고침 먼저 실행
              await queryClient.invalidateQueries({ queryKey: ["tags"] });

              // 잠시 대기하여 쿼리가 업데이트되도록 함
              await new Promise((resolve) => setTimeout(resolve, 100));

              // 새로 생성된 티커 추가
              if (newTicker.tag?.id) {
                console.log(
                  `'${tickerSymbol}' 티커가 성공적으로 등록되었습니다.`,
                );
                // 자동으로 $ 기호가 추가되었음을 사용자에게 알림
                if (wasAutoAdded) {
                  console.log(
                    `입력하신 '${originalInput.toUpperCase()}'가 '${tickerSymbol}'로 등록되었습니다.`,
                  );
                }
                addTicker(newTicker.tag.id);
              }
            } catch (error: any) {
              console.error("티커 생성 실패:", error);
              alert(`티커 생성 실패: ${error.message || "알 수 없는 오류"}`);
            } finally {
              setIsCreatingTicker(false);
            }
          }
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTicker(value.length - 1);
    }
  };

  const addTicker = (tickerId: string) => {
    if (!value.includes(tickerId)) {
      onChange([...value, tickerId]);
    }
    setInputValue("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const removeTicker = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div style={{ position: "relative" }}>
      {/* 추천 티커 목록 */}
      {tickerTags.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "#6B7280",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            인기 기업 티커 (클릭하여 추가)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {tickerTags
              .filter((tag: any) => !value.includes(tag.id))
              .slice(0, 15)
              .map((tag: any) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => addTicker(tag.id)}
                  style={{
                    padding: "4px 12px",
                    backgroundColor: "#E0E7FF",
                    color: "#3730A3",
                    border: "1px solid #C7D2FE",
                    borderRadius: "16px",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.1)";
                    e.currentTarget.style.backgroundColor = "#C7D2FE";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.backgroundColor = "#E0E7FF";
                  }}
                >
                  {tag.name}
                </button>
              ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "10px",
          border: `2px solid ${showSuggestions ? "#3730A3" : "#E5E7EB"}`,
          borderRadius: "12px",
          backgroundColor: "#F8F9FF",
          minHeight: "52px",
          alignItems: "center",
          transition: "all 0.2s",
        }}
      >
        {/* 선택된 티커 표시 */}
        {value.map((tickerId, index) => {
          const tickerInfo = tickerTags?.find((t: any) => t.id === tickerId);
          if (!tickerInfo) return null;

          return (
            <span
              key={tickerId}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                backgroundColor: "#3730A3",
                color: colors.white,
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "500",
                animation: "slideIn 0.2s ease-out",
              }}
            >
              {tickerInfo.name}
              <button
                type="button"
                onClick={() => removeTicker(index)}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.white,
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            let value = e.target.value.toUpperCase();
            // $ 기호는 자동으로 제거
            value = value.replace(/\$/g, "");
            setInputValue(value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }, 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "14px",
            minWidth: "150px",
            color: "#374151",
          }}
        />
      </div>

      {/* 자동완성 드롭다운 */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: colors.white,
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px rgba(0, 0, 0, 0.08), 0 6px 10px rgba(0, 0, 0, 0.05)",
            zIndex: 1000,
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((tag: any, index: number) => (
            <div
              key={tag.id}
              onClick={() => addTicker(tag.id)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                backgroundColor:
                  index === selectedIndex ? "#F3F4F6" : "transparent",
                borderBottom:
                  index < suggestions.length - 1 ? "1px solid #F3F4F6" : "none",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "500", color: "#111827" }}>
                    {tag.name}
                  </div>
                  {tag.description && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        marginTop: "2px",
                      }}
                    >
                      {tag.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// News Management Component
const NewsManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [commentsModalData, setCommentsModalData] = useState<{
    newsId: string;
    title: string;
  } | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    source: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<
    "title" | "created_at" | "view_count"
  >("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  // 검색 디바운싱 - 타이핑이 끝난 후 500ms 후에 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      if (searchInput !== searchQuery) {
        setPage(1); // 검색어가 변경되면 첫 페이지로 이동
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // 자동 저장 기능 - 폼 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (isModalOpen && !editingNews) {
      const draftData = {
        formData,
        htmlContent,
        selectedTags,
        selectedTickers,
        timestamp: Date.now(),
      };
      localStorage.setItem("newsFormDraft", JSON.stringify(draftData));
    }
  }, [
    formData,
    htmlContent,
    selectedTags,
    selectedTickers,
    isModalOpen,
    editingNews,
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["news", page, pageSize, searchQuery, sortField, sortOrder],
    queryFn: () =>
      api.getNews(
        searchQuery && searchQuery.trim() !== "" ? searchQuery : undefined,
        page,
        pageSize,
        `${sortField}_${sortOrder}`,
      ),
  });

  // 정렬 핸들러
  const handleSort = (field: "title" | "created_at" | "view_count") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags(),
  });

  const createMutation = useMutation({
    mutationFn: api.createNews,
    onMutate: () => setIsSaving(true),
    onSettled: () => setIsSaving(false),
    onSuccess: async (data) => {
      console.log("뉴스 생성 응답:", data);

      try {
        // 뉴스 생성 성공 후 기본 투표 설정 생성
        // API 응답 구조에 따라 newsId 추출
        const newsId = data.news?.id || data.id || data.news_id;

        if (!newsId) {
          console.error("뉴스 ID를 찾을 수 없습니다. 응답:", data);
          return;
        }

        console.log("생성된 뉴스 ID:", newsId);

        const voteData: api.VoteSettingData = {
          target_id: newsId,
          title: "이 뉴스에 대한 여러분의 생각은?",
          description: "긍정적 또는 부정적으로 투표해주세요",
          options: [
            { key: "positive", label: "긍정적" },
            { key: "negative", label: "부정적" },
          ],
          multiple_choice: false,
          // 종료일 없음 - 영구 투표
        };

        console.log("투표 설정 데이터:", voteData);
        const voteResult = await api.createVoteSetting(voteData);
        console.log("투표 설정 생성 결과:", voteResult);
      } catch (voteError) {
        console.error("투표 설정 생성 실패:", voteError);
        // 투표 생성 실패해도 뉴스는 이미 생성됨
      }

      // localStorage 임시 저장 데이터 삭제
      localStorage.removeItem("newsFormDraft");

      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] }); // 태그도 새로고침
      alert("뉴스가 성공적으로 등록되었습니다.");
      closeModal();
      setFormData({
        title: "",
        source: "",
      });
      setSelectedTags([]);
      setSelectedTickers([]);
      setHtmlContent("");
    },
    onError: (error: any) => {
      console.error("뉴스 생성 에러:", error);
      alert(error.message || "뉴스 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: api.NewsData }) =>
      api.updateNews(id, data),
    onMutate: () => setIsSaving(true),
    onSettled: () => setIsSaving(false),
    onSuccess: () => {
      // localStorage 임시 저장 데이터 삭제
      localStorage.removeItem("newsFormDraft");

      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      alert("뉴스가 성공적으로 수정되었습니다.");
      closeModal();
      setFormData({
        title: "",
        source: "",
      });
      setSelectedTags([]);
      setSelectedTickers([]);
      setHtmlContent("");
    },
    onError: (error: any) => {
      console.error("뉴스 수정 에러:", error);
      alert(error.message || "뉴스 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      alert("뉴스가 성공적으로 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "뉴스 삭제에 실패했습니다.");
    },
  });

  const openModal = async (news?: any) => {
    if (news) {
      setEditingNews(news);
      // 뉴스 상세 정보를 가져와서 content 배열 형식 확인
      try {
        const detailData = await api.getNewsDetail(news.id);
        const newsDetail = detailData.news;

        setFormData({
          title: newsDetail.title || "",
          source: newsDetail.source || "",
        });
        // Convert tag names to IDs if needed
        console.log("News detail tags:", newsDetail.tags);
        console.log("Available tags:", tagsData?.tags);

        if (newsDetail.tags && newsDetail.tags.length > 0) {
          // tags가 객체 배열인지 문자열 배열인지 확인
          const firstTag = newsDetail.tags[0];
          let allTagIds: string[] = [];

          if (typeof firstTag === "object" && firstTag !== null) {
            // 태그가 객체인 경우 (예: {id: "...", name: "..."})
            allTagIds = newsDetail.tags.map(
              (tag: any) => tag.id || tag._id || tag,
            );
          } else if (typeof firstTag === "string") {
            // 태그가 문자열인 경우
            if (firstTag.length > 20 && firstTag.includes("-")) {
              // UUID 형식인 경우 (이미 ID)
              allTagIds = newsDetail.tags;
            } else {
              // 태그 이름인 경우 ID로 변환
              allTagIds = newsDetail.tags
                .map((tagName: string) => {
                  const tag = tagsData?.tags?.find(
                    (t: any) => t.name === tagName || t.id === tagName,
                  );
                  return tag?.id || tagName;
                })
                .filter((id: string) => id);
            }
          }

          // 티커와 일반 태그 분리 (중복 제거)
          const regularTagIds: string[] = [];
          const tickerIds: string[] = [];

          // 중복 제거
          const uniqueTagIds = allTagIds.filter(
            (tagId, index, self) => self.indexOf(tagId) === index,
          );

          uniqueTagIds.forEach((tagId: string) => {
            const tagInfo = tagsData?.tags?.find((t: any) => t.id === tagId);
            if (tagInfo && tagInfo.is_ticker) {
              tickerIds.push(tagId);
            } else {
              regularTagIds.push(tagId);
            }
          });

          console.log("Separated regular tags:", regularTagIds);
          console.log("Separated ticker tags:", tickerIds);

          setSelectedTags(regularTagIds);
          setSelectedTickers(tickerIds);
        } else {
          setSelectedTags([]);
          setSelectedTickers([]);
        }

        // content를 HTML로 변환
        console.log("News detail content:", newsDetail.content);
        if (Array.isArray(newsDetail.content)) {
          const html = convertContentBlocksToHtml(newsDetail.content);
          console.log("Converted HTML:", html);
          setHtmlContent(html);
        } else if (typeof newsDetail.content === "string") {
          setHtmlContent(`<p>${newsDetail.content}</p>`);
        } else {
          setHtmlContent("");
        }
      } catch (error) {
        console.error("Failed to fetch news detail:", error);
        // 상세 정보를 가져오지 못한 경우 기본값 사용
        setFormData({
          title: news.title || "",
          source: news.source || "",
        });
        // Convert tag names to IDs
        console.log("Fallback news tags:", news.tag_names);
        if (news.tag_names && news.tag_names.length > 0) {
          const regularTagIds: string[] = [];
          const tickerIds: string[] = [];

          news.tag_names.forEach((tagName: string) => {
            const tag = tagsData?.tags?.find((t: any) => t.name === tagName);
            if (tag) {
              if (tag.is_ticker) {
                // 중복 체크
                if (!tickerIds.includes(tag.id)) {
                  tickerIds.push(tag.id);
                }
              } else {
                if (!regularTagIds.includes(tag.id)) {
                  regularTagIds.push(tag.id);
                }
              }
            }
          });

          console.log("Fallback regular tags:", regularTagIds);
          console.log("Fallback ticker tags:", tickerIds);
          setSelectedTags(regularTagIds);
          setSelectedTickers(tickerIds);
        } else if (news.tags && news.tags.length > 0) {
          // 만약 tag_names가 없지만 tags가 있는 경우
          console.log("Using news.tags:", news.tags);
          setSelectedTags(news.tags);
          setSelectedTickers([]);
        } else {
          setSelectedTags([]);
          setSelectedTickers([]);
        }
        setHtmlContent(news.content ? `<p>${news.content}</p>` : "");
      }
    } else {
      setEditingNews(null);

      // localStorage에서 임시 저장된 데이터 확인
      const savedDraft = localStorage.getItem("newsFormDraft");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          // 24시간 이내의 데이터만 복원
          if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
            if (
              window.confirm(
                "이전에 작성 중이던 내용이 있습니다. 복원하시겠습니까?",
              )
            ) {
              setFormData(draft.formData || { title: "", source: "" });
              setHtmlContent(draft.htmlContent || "");
              setSelectedTags(draft.selectedTags || []);
              setSelectedTickers(draft.selectedTickers || []);
            } else {
              // 복원하지 않으면 초기화하고 localStorage 삭제
              localStorage.removeItem("newsFormDraft");
              setFormData({ title: "", source: "" });
              setSelectedTags([]);
              setSelectedTickers([]);
              setHtmlContent("");
            }
          } else {
            // 24시간이 지난 데이터는 삭제
            localStorage.removeItem("newsFormDraft");
            setFormData({ title: "", source: "" });
            setSelectedTags([]);
            setSelectedTickers([]);
            setHtmlContent("");
          }
        } catch (error) {
          console.error("임시 저장 데이터 복원 실패:", error);
          setFormData({ title: "", source: "" });
          setSelectedTags([]);
          setSelectedTickers([]);
          setHtmlContent("");
        }
      } else {
        setFormData({ title: "", source: "" });
        setSelectedTags([]);
        setSelectedTickers([]);
        setHtmlContent("");
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setSelectedTags([]);
    setSelectedTickers([]);
    setHtmlContent("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = [];
    if (!formData.title) errors.push("• 제목을 입력해주세요");
    if (
      !htmlContent ||
      htmlContent === "<p><br></p>" ||
      htmlContent.trim() === ""
    ) {
      errors.push("• 내용을 입력해주세요");
    }

    if (errors.length > 0) {
      alert("필수 항목을 확인해주세요:\n\n" + errors.join("\n"));
      return;
    }

    console.log("제출할 데이터:", {
      title: formData.title,
      source: formData.source,
      tags: selectedTags,
      htmlContent: htmlContent,
    });

    // Convert HTML to content blocks
    const contentBlocks = convertHtmlToContentBlocks(htmlContent);

    // 첫 번째 이미지를 썸네일로 추출
    let thumbnailUrl: string | undefined;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const firstImage = doc.querySelector("img");
    if (firstImage) {
      thumbnailUrl = firstImage.src;
      // API_BASE_URL이 포함된 경우 상대 경로로 변환
      if (thumbnailUrl.startsWith(API_BASE_URL)) {
        thumbnailUrl = thumbnailUrl.replace(API_BASE_URL, "");
      }
    }

    const newsData: api.NewsData = {
      title: formData.title,
      content: contentBlocks,
      source: formData.source,
      tags: [...selectedTags, ...selectedTickers], // 일반 태그와 티커 합치기
      thumbnail: thumbnailUrl,
    };

    if (editingNews) {
      if (window.confirm("뉴스를 수정하시겠습니까?")) {
        updateMutation.mutate({ id: editingNews.id, data: newsData });
      }
    } else {
      if (window.confirm("뉴스를 등록하시겠습니까?")) {
        createMutation.mutate(newsData);
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>뉴스 관리</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="뉴스 검색..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  // Enter 키를 누르면 즉시 검색 실행
                  setSearchQuery(searchInput);
                  setPage(1);
                }
              }}
              style={{
                padding: "10px 40px 10px 16px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                fontSize: "14px",
                width: "250px",
              }}
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  setPage(1);
                }}
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "transparent",
                  border: "none",
                  color: colors.gray[400],
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "18px",
                  lineHeight: "1",
                }}
                title="검색 초기화"
              >
                ×
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <span style={{ fontSize: "14px", color: colors.gray[600] }}>
              페이지당
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                backgroundColor: colors.white,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="10">10개</option>
              <option value="20">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
          </div>

          <button style={styles.addButton} onClick={() => openModal()}>
            <span>+</span> 뉴스 추가
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {data?.news_list?.length === 0 ? (
          <EmptyState
            message={
              searchQuery
                ? `"${searchQuery}"에 대한 검색 결과가 없습니다`
                : "아직 등록된 뉴스가 없습니다"
            }
            icon={searchQuery ? "🔍" : "📰"}
            actionText={searchQuery ? "검색 초기화" : "첫 뉴스 작성하기"}
            onAction={() =>
              searchQuery
                ? (setSearchInput(""), setSearchQuery(""))
                : openModal()
            }
          />
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, width: "15%" }}>ID</th>
                    <th
                      style={{ ...styles.th, width: "25%", cursor: "pointer" }}
                      onClick={() => handleSort("title")}
                    >
                      제목{" "}
                      {sortField === "title" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th style={{ ...styles.th, width: "10%" }}>출처</th>
                    <th style={{ ...styles.th, width: "10%" }}>작성자</th>
                    <th
                      style={{ ...styles.th, width: "12%", cursor: "pointer" }}
                      onClick={() => handleSort("created_at")}
                    >
                      작성일{" "}
                      {sortField === "created_at" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      style={{ ...styles.th, width: "8%", cursor: "pointer" }}
                      onClick={() => handleSort("view_count")}
                    >
                      조회수{" "}
                      {sortField === "view_count" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th style={{ ...styles.th, width: "8%" }}>댓글</th>
                    <th style={{ ...styles.th, width: "12%" }}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.news_list?.map((news: any) => (
                    <tr
                      key={news.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === news.id ? styles.tableRowHover : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(news.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6B7280",
                            fontFamily: "monospace",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={news.id}
                        >
                          {news.id}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div
                          style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {news.title}
                        </div>
                      </td>
                      <td style={styles.td}>{news.source}</td>
                      <td style={styles.td}>{news.author_name}</td>
                      <td style={styles.td}>
                        {new Date(news.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {news.view_count.toLocaleString()}
                      </td>
                      <td style={styles.td}>{news.comment_count}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={{
                              ...styles.actionButton,
                              backgroundColor: colors.purple[500],
                            }}
                            onClick={() =>
                              setCommentsModalData({
                                newsId: news.id,
                                title: news.title,
                              })
                            }
                            title="댓글 보기"
                          >
                            댓글
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton,
                            }}
                            onClick={() => openModal(news)}
                            title="뉴스 수정"
                          >
                            수정
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                            onClick={() => handleDelete(news.id)}
                            title="뉴스 삭제"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "800px",
              maxHeight: "95vh",
              margin: "20px auto",
            }}
          >
            <div style={{ ...styles.modalHeader, position: "relative" }}>
              <h2 style={styles.modalTitle}>
                {editingNews ? "뉴스 수정" : "뉴스 추가"}
                {isSaving && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: colors.gray[500],
                      marginLeft: "12px",
                    }}
                  >
                    저장 중...
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const hasContent =
                    formData.title ||
                    formData.source ||
                    htmlContent ||
                    selectedTags.length > 0 ||
                    selectedTickers.length > 0;
                  if (hasContent && !editingNews) {
                    const result = window.confirm(
                      "작성 중인 내용을 임시 저장하시겠습니까?\n\n확인: 임시 저장 후 닫기\n취소: 저장하지 않고 닫기",
                    );
                    if (result) {
                      // 임시 저장 후 닫기
                      const draftData = {
                        formData,
                        htmlContent,
                        selectedTags,
                        selectedTickers,
                        timestamp: Date.now(),
                      };
                      localStorage.setItem(
                        "newsFormDraft",
                        JSON.stringify(draftData),
                      );
                      alert(
                        "임시 저장되었습니다. 다음에 뉴스 추가를 누르면 복원됩니다.",
                      );
                      closeModal();
                    } else {
                      // 저장하지 않고 닫기
                      if (
                        window.confirm(
                          "임시 저장하지 않고 닫으시겠습니까? 작성 중인 내용이 모두 사라집니다.",
                        )
                      ) {
                        localStorage.removeItem("newsFormDraft");
                        closeModal();
                      }
                    }
                  } else {
                    closeModal();
                    localStorage.removeItem("newsFormDraft");
                  }
                }}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  fontSize: "28px",
                  fontWeight: "300",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "0",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";
                }}
                title="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>제목 *</label>
                  <input
                    style={styles.input}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="뉴스 제목을 입력하세요"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>출처</label>
                  <input
                    style={styles.input}
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    placeholder="뉴스 출처 (예: 한국경제, 매일경제 등)"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>태그</label>
                  <TagInput
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="태그를 입력하세요"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>기업 티커 💹</label>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginBottom: "8px",
                    }}
                  >
                    티커를 입력하고 Enter를 누르세요. (예: NVDA, AAPL 또는
                    $NVDA, $AAPL)
                    <br />
                    <span style={{ color: "#10B981" }}>
                      ✓ $ 기호는 자동으로 추가됩니다
                    </span>
                  </div>
                  <TickerInput
                    value={selectedTickers}
                    onChange={setSelectedTickers}
                    placeholder="티커를 입력하세요 (예: NVDA 또는 $NVDA)"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>내용 *</label>
                  <RichEditor
                    value={htmlContent}
                    onChange={setHtmlContent}
                    placeholder="뉴스 내용을 입력하세요..."
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    backgroundColor: colors.gray[300],
                    color: colors.gray[700],
                    width: "auto",
                  }}
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    width: "auto",
                    opacity: isSaving ? 0.6 : 1,
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                  disabled={isSaving}
                >
                  {isSaving
                    ? "처리 중..."
                    : editingNews
                    ? "수정하기"
                    : "등록하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {commentsModalData && (
        <NewsCommentsModal
          newsId={commentsModalData.newsId}
          newsTitle={commentsModalData.title}
          onClose={() => setCommentsModalData(null)}
        />
      )}
    </div>
  );
};

// News Comments Modal Component
const NewsCommentsModal: React.FC<{
  newsId: string;
  newsTitle: string;
  onClose: () => void;
}> = ({ newsId, newsTitle, onClose }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["news-comments", newsId, page, pageSize],
    queryFn: async () => {
      console.log("Fetching comments for news:", newsId);
      const result = await api.getCommentsList(
        page,
        pageSize,
        undefined,
        undefined,
        newsId,
        "news",
        undefined,
        "created_at_desc",
        false,
      );
      console.log("Comments result:", result);

      // 만약 백엔드가 필터링을 제대로 하지 않는다면 프론트에서 필터링
      if (result.comments && Array.isArray(result.comments)) {
        const filteredComments = result.comments.filter(
          (c: any) => c.target_id === newsId,
        );
        return {
          ...result,
          comments: filteredComments,
          total_count: filteredComments.length,
        };
      }

      return result;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news-comments"] });
      alert("댓글이 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(`삭제 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div
        style={{ ...styles.modalContent, maxWidth: "900px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            ...styles.modalHeader,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ ...styles.modalTitle, margin: 0 }}>뉴스 댓글</h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: colors.gray[600],
              }}
            >
              {newsTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              ...styles.modalCloseButton,
              position: "relative",
              top: "auto",
              right: "auto",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={styles.modalBody}>
          {isLoading ? (
            <div style={styles.loadingMessage}>댓글을 불러오는 중...</div>
          ) : error ? (
            <div style={styles.errorMessage}>
              댓글을 불러오는 중 오류가 발생했습니다.
            </div>
          ) : (
            <>
              <div
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  backgroundColor: colors.gray[50],
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                {data?.comments &&
                Array.isArray(data.comments) &&
                data.comments.length > 0 ? (
                  data.comments.map((comment: any, index: number) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: "12px",
                        marginBottom:
                          index < data.comments.length - 1 ? "8px" : "0",
                        backgroundColor: comment.is_deleted
                          ? colors.gray[100]
                          : colors.white,
                        borderRadius: "6px",
                        border: `1px solid ${
                          comment.is_deleted
                            ? colors.gray[300]
                            : colors.gray[200]
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: colors.gray[800],
                              }}
                            >
                              {comment.author_name}
                            </span>
                            <span
                              style={{
                                color: colors.gray[500],
                                fontSize: "12px",
                              }}
                            >
                              {formatDate(comment.created_at)}
                            </span>
                            {comment.is_deleted && (
                              <span
                                style={{
                                  padding: "2px 6px",
                                  backgroundColor: colors.gray[300],
                                  color: colors.gray[700],
                                  borderRadius: "3px",
                                  fontSize: "11px",
                                  fontWeight: "500",
                                }}
                              >
                                삭제됨
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              color: colors.gray[700],
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                          >
                            {(() => {
                              let content = comment.content;

                              // content가 문자열이고 JSON처럼 보이면 파싱 시도
                              if (
                                typeof content === "string" &&
                                content.startsWith("[") &&
                                content.endsWith("]")
                              ) {
                                try {
                                  const parsed = JSON.parse(content);
                                  if (Array.isArray(parsed)) {
                                    // 파싱된 배열에서 텍스트 추출
                                    return parsed
                                      .map((item: any) => {
                                        if (typeof item === "string")
                                          return item;
                                        if (
                                          item.type === "text" &&
                                          item.content
                                        )
                                          return item.content;
                                        if (item.type === "image")
                                          return "[이미지]";
                                        return "";
                                      })
                                      .filter(Boolean)
                                      .join(" ");
                                  }
                                } catch {
                                  // 파싱 실패시 원본 반환
                                  return content;
                                }
                              }

                              // content가 이미 배열인 경우
                              if (Array.isArray(content)) {
                                return content
                                  .map((item: any) => {
                                    if (typeof item === "string") return item;
                                    if (item.type === "text" && item.content)
                                      return item.content;
                                    if (item.type === "image")
                                      return "[이미지]";
                                    return "";
                                  })
                                  .filter(Boolean)
                                  .join(" ");
                              }

                              // 일반 문자열인 경우
                              if (typeof content === "string") {
                                return content;
                              }

                              // 기타 경우
                              return JSON.stringify(content);
                            })()}
                          </div>
                        </div>
                        {!comment.is_deleted && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm("이 댓글을 삭제하시겠습니까?")
                              ) {
                                deleteMutation.mutate(comment.id);
                              }
                            }}
                            style={{
                              padding: "6px 12px",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: colors.gray[700],
                              backgroundColor: colors.white,
                              border: `1px solid ${colors.gray[300]}`,
                              borderRadius: "4px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.red[50];
                              e.currentTarget.style.borderColor =
                                colors.red[300];
                              e.currentTarget.style.color = colors.red[600];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.white;
                              e.currentTarget.style.borderColor =
                                colors.gray[300];
                              e.currentTarget.style.color = colors.gray[700];
                            }}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: colors.gray[500],
                    }}
                  >
                    댓글이 없습니다.
                  </div>
                )}
              </div>
              {data && Number(data.total_count) > 0 && (
                <div style={{ ...styles.pagination, marginTop: "16px" }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      ...styles.paginationButton,
                      ...(page === 1 ? styles.paginationButtonDisabled : {}),
                    }}
                  >
                    이전
                  </button>
                  <span style={styles.paginationInfo}>
                    {page} / {Math.ceil(Number(data.total_count) / pageSize)}{" "}
                    페이지 (총 {data.total_count}개)
                  </span>
                  <button
                    onClick={() =>
                      setPage(
                        Math.min(
                          Math.ceil(Number(data.total_count) / pageSize),
                          page + 1,
                        ),
                      )
                    }
                    disabled={
                      page >= Math.ceil(Number(data.total_count) / pageSize)
                    }
                    style={{
                      ...styles.paginationButton,
                      ...(page >= Math.ceil(Number(data.total_count) / pageSize)
                        ? styles.paginationButtonDisabled
                        : {}),
                    }}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Report Management Component
const ReportManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    pdf_url: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // 자동 저장 기능 - 폼 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (isModalOpen && !editingReport) {
      const draftData = {
        formData,
        htmlContent,
        selectedTags,
        selectedTickers,
        timestamp: Date.now(),
      };
      localStorage.setItem("reportFormDraft", JSON.stringify(draftData));
    }
  }, [
    formData,
    htmlContent,
    selectedTags,
    selectedTickers,
    isModalOpen,
    editingReport,
  ]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", page, pageSize, searchQuery],
    queryFn: () => api.getReports(searchQuery || undefined, page, pageSize),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => api.getTags(),
  });

  const createMutation = useMutation({
    mutationFn: api.createReport,
    onSuccess: () => {
      // localStorage 임시 저장 데이터 삭제
      localStorage.removeItem("reportFormDraft");

      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      alert("리포트가 성공적으로 등록되었습니다.");
      closeModal();
      setFormData({
        title: "",
        pdf_url: "",
      });
      setSelectedTags([]);
      setSelectedTickers([]);
      setHtmlContent("");
    },
    onError: (error: any) => {
      alert(error.message || "리포트 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: api.ReportData }) =>
      api.updateReport(id, data),
    onSuccess: () => {
      // localStorage 임시 저장 데이터 삭제
      localStorage.removeItem("reportFormDraft");

      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      alert("리포트가 성공적으로 수정되었습니다.");
      closeModal();
      setFormData({
        title: "",
        pdf_url: "",
      });
      setSelectedTags([]);
      setSelectedTickers([]);
      setHtmlContent("");
    },
    onError: (error: any) => {
      alert(error.message || "리포트 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      alert("리포트가 성공적으로 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "리포트 삭제에 실패했습니다.");
    },
  });

  const openModal = async (report?: any) => {
    if (report) {
      setEditingReport(report);
      // 리포트 상세 정보를 가져와서 content 배열 형식 확인
      try {
        const detailData = await api.getReportDetail(report.id);
        const reportDetail = detailData.report;

        setFormData({
          title: reportDetail.title || "",
          pdf_url: reportDetail.pdf_url || "",
        });
        // Convert tag names to IDs if needed
        if (reportDetail.tags && reportDetail.tags.length > 0) {
          let allTagIds: string[] = [];
          // Check if tags are already IDs or names
          const firstTag = reportDetail.tags[0];
          if (typeof firstTag === "string" && firstTag.length > 20) {
            // Likely already IDs (UUIDs are long)
            allTagIds = reportDetail.tags;
          } else {
            // Convert names to IDs
            allTagIds = reportDetail.tags
              .map((tagName: string) => {
                const tag = tagsData?.tags?.find(
                  (t: any) => t.name === tagName,
                );
                return tag?.id || tagName;
              })
              .filter((id: string) => id);
          }

          // 티커와 일반 태그 분리 (중복 제거)
          const regularTagIds: string[] = [];
          const tickerIds: string[] = [];

          // 중복 제거
          const uniqueTagIds = allTagIds.filter(
            (tagId, index, self) => self.indexOf(tagId) === index,
          );

          uniqueTagIds.forEach((tagId: string) => {
            const tagInfo = tagsData?.tags?.find((t: any) => t.id === tagId);
            if (tagInfo && tagInfo.is_ticker) {
              tickerIds.push(tagId);
            } else {
              regularTagIds.push(tagId);
            }
          });

          console.log("Separated regular tags:", regularTagIds);
          console.log("Separated ticker tags:", tickerIds);

          setSelectedTags(regularTagIds);
          setSelectedTickers(tickerIds);
        } else {
          setSelectedTags([]);
          setSelectedTickers([]);
        }

        // content를 HTML로 변환
        if (Array.isArray(reportDetail.content)) {
          const html = convertContentBlocksToHtml(reportDetail.content);
          setHtmlContent(html);
        } else if (typeof reportDetail.content === "string") {
          setHtmlContent(`<p>${reportDetail.content}</p>`);
        } else {
          setHtmlContent("");
        }
      } catch (error) {
        console.error("Failed to fetch report detail:", error);
        // 상세 정보를 가져오지 못한 경우 기본값 사용
        setFormData({
          title: report.title || "",
          pdf_url: "",
        });
        // Convert tag names to IDs
        if (report.tag_names && report.tag_names.length > 0) {
          const tagIds = report.tag_names
            .map((tagName: string) => {
              const tag = tagsData?.tags?.find((t: any) => t.name === tagName);
              return tag?.id;
            })
            .filter((id: string) => id);
          setSelectedTags(tagIds);
        } else {
          setSelectedTags([]);
        }
        setHtmlContent(report.content ? `<p>${report.content}</p>` : "");
      }
    } else {
      setEditingReport(null);

      // localStorage에서 임시 저장된 데이터 확인
      const savedDraft = localStorage.getItem("reportFormDraft");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          // 24시간 이내의 데이터만 복원
          if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
            if (
              window.confirm(
                "이전에 작성 중이던 내용이 있습니다. 복원하시겠습니까?",
              )
            ) {
              setFormData(draft.formData || { title: "", pdf_url: "" });
              setHtmlContent(draft.htmlContent || "");
              setSelectedTags(draft.selectedTags || []);
              setSelectedTickers(draft.selectedTickers || []);
            } else {
              // 복원하지 않으면 초기화하고 localStorage 삭제
              localStorage.removeItem("reportFormDraft");
              setFormData({ title: "", pdf_url: "" });
              setSelectedTags([]);
              setSelectedTickers([]);
              setHtmlContent("");
            }
          } else {
            // 24시간이 지난 데이터는 삭제
            localStorage.removeItem("reportFormDraft");
            setFormData({ title: "", pdf_url: "" });
            setSelectedTags([]);
            setSelectedTickers([]);
            setHtmlContent("");
          }
        } catch (error) {
          console.error("임시 저장 데이터 복원 실패:", error);
          setFormData({ title: "", pdf_url: "" });
          setSelectedTags([]);
          setSelectedTickers([]);
          setHtmlContent("");
        }
      } else {
        setFormData({ title: "", pdf_url: "" });
        setSelectedTags([]);
        setSelectedTickers([]);
        setHtmlContent("");
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReport(null);
    setSelectedTags([]);
    setHtmlContent("");
  };

  // Remove old content block helper functions - no longer needed with RichEditor

  // Old moveContentBlock function removed - no longer needed with RichEditor

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert("제목은 필수입니다.");
      return;
    }

    // Validate HTML content
    if (
      !htmlContent ||
      htmlContent === "<p><br></p>" ||
      htmlContent.trim() === ""
    ) {
      alert("내용을 입력해주세요.");
      return;
    }

    // Convert HTML to content blocks
    const contentBlocks = convertHtmlToContentBlocks(htmlContent);

    const reportData: api.ReportData = {
      title: formData.title,
      content: contentBlocks,
      pdf_url: formData.pdf_url || undefined,
      tags: [...selectedTags, ...selectedTickers], // 일반 태그와 티커 합치기
    };

    if (editingReport) {
      updateMutation.mutate({ id: editingReport.id, data: reportData });
    } else {
      createMutation.mutate(reportData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>리포트 관리</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="리포트 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setSearchQuery(searchInput);
                  setPage(1);
                }
              }}
              style={{
                padding: "10px 40px 10px 16px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                fontSize: "14px",
                width: "250px",
              }}
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchQuery("");
                  setPage(1);
                }}
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "transparent",
                  border: "none",
                  color: colors.gray[400],
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "18px",
                  lineHeight: "1",
                }}
                title="검색 초기화"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => {
              setSearchQuery(searchInput);
              setPage(1);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: colors.primary,
              color: colors.white,
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            검색
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <span style={{ fontSize: "14px", color: colors.gray[600] }}>
              페이지당
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                backgroundColor: colors.white,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="10">10개</option>
              <option value="20">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
          </div>
          <button style={styles.addButton} onClick={() => openModal()}>
            <span>+</span> 리포트 추가
          </button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {data?.reports?.length === 0 ? (
          <EmptyState message="등록된 리포트가 없습니다." icon="" />
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>제목</th>
                    <th style={styles.th}>작성자</th>
                    <th style={styles.th}>작성일</th>
                    <th style={styles.th}>조회수</th>
                    <th style={styles.th}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.reports?.map((report: any) => (
                    <tr
                      key={report.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === report.id
                          ? styles.tableRowHover
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(report.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>{report.title}</td>
                      <td style={styles.td}>{report.author_name}</td>
                      <td style={styles.td}>
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {report.view_count.toLocaleString()}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton,
                            }}
                            onClick={() => openModal(report)}
                          >
                            수정
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                            onClick={() => handleDelete(report.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ ...styles.modalHeader, position: "relative" }}>
              <h2 style={styles.modalTitle}>
                {editingReport ? "리포트 수정" : "리포트 추가"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const hasContent =
                    formData.title ||
                    formData.pdf_url ||
                    htmlContent ||
                    selectedTags.length > 0 ||
                    selectedTickers.length > 0;
                  if (hasContent && !editingReport) {
                    const result = window.confirm(
                      "작성 중인 내용을 임시 저장하시겠습니까?\n\n확인: 임시 저장 후 닫기\n취소: 저장하지 않고 닫기",
                    );
                    if (result) {
                      // 임시 저장 후 닫기
                      const draftData = {
                        formData,
                        htmlContent,
                        selectedTags,
                        selectedTickers,
                        timestamp: Date.now(),
                      };
                      localStorage.setItem(
                        "reportFormDraft",
                        JSON.stringify(draftData),
                      );
                      alert(
                        "임시 저장되었습니다. 다음에 리포트 추가를 누르면 복원됩니다.",
                      );
                      closeModal();
                    } else {
                      // 저장하지 않고 닫기
                      if (
                        window.confirm(
                          "임시 저장하지 않고 닫으시겠습니까? 작성 중인 내용이 모두 사라집니다.",
                        )
                      ) {
                        localStorage.removeItem("reportFormDraft");
                        closeModal();
                      }
                    }
                  } else {
                    closeModal();
                    localStorage.removeItem("reportFormDraft");
                  }
                }}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  fontSize: "28px",
                  fontWeight: "300",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "0",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";
                }}
                title="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>제목 *</label>
                  <input
                    style={styles.input}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="리포트 제목을 입력하세요"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>내용 *</label>
                  <div
                    style={{
                      backgroundColor: "#FEF3C7",
                      border: "1px solid #F59E0B",
                      borderRadius: "6px",
                      padding: "12px",
                      marginBottom: "12px",
                      fontSize: "14px",
                      color: "#92400E",
                    }}
                  >
                    <strong>이미지 표시 관련 안내</strong>
                    <br />
                    이미지 업로드로 게시글 작성이 가능하나, 현재 프론트엔드에서
                    이미지 표시가 이루어지지 않고 있습니다.
                    <br />
                    업로드된 이미지는 저장되며, 추후 업데이트를 통해 정상적으로
                    표시될 예정입니다.
                  </div>
                  <RichEditor
                    value={htmlContent}
                    onChange={setHtmlContent}
                    placeholder="리포트 내용을 입력하세요..."
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>PDF URL</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      style={{ ...styles.input, flex: 1 }}
                      value={formData.pdf_url}
                      onChange={(e) =>
                        setFormData({ ...formData, pdf_url: e.target.value })
                      }
                      placeholder="https://example.com/report.pdf"
                    />
                    <label
                      style={{
                        padding: "10px 20px",
                        backgroundColor: colors.secondary,
                        color: colors.white,
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "14px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      PDF 업로드
                      <input
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const response = await api.uploadDocument(file);
                              setFormData({
                                ...formData,
                                pdf_url: response.file_url,
                              });
                              alert("PDF가 성공적으로 업로드되었습니다.");
                            } catch (error: any) {
                              alert(
                                error.message || "PDF 업로드에 실패했습니다.",
                              );
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  {formData.pdf_url && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: colors.gray[600],
                      }}
                    >
                      <a
                        href={formData.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: colors.primary }}
                      >
                        PDF 미리보기
                      </a>
                    </div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>태그</label>
                  <TagInput
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="태그를 입력하세요"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>기업 티커 💹</label>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginBottom: "8px",
                    }}
                  >
                    티커를 입력하고 Enter를 누르세요. (예: NVDA, AAPL 또는
                    $NVDA, $AAPL)
                    <br />
                    <span style={{ color: "#10B981" }}>
                      ✓ $ 기호는 자동으로 추가됩니다
                    </span>
                  </div>
                  <TickerInput
                    value={selectedTickers}
                    onChange={setSelectedTickers}
                    placeholder="티커를 입력하세요 (예: NVDA 또는 $NVDA)"
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    backgroundColor: colors.gray[300],
                    color: colors.gray[700],
                    width: "auto",
                  }}
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    width: "auto",
                  }}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "저장 중..."
                    : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// User Management Component
const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [statusFormData, setStatusFormData] = useState<api.UserStatusUpdate>({
    is_banned: false,
    role: "USER",
    ban_reason: "",
  });

  const queryClient = useQueryClient();

  // 회원 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "users",
      page,
      pageSize,
      searchQuery,
      roleFilter,
      bannedFilter,
      sortBy,
    ],
    queryFn: () =>
      api.getUserList(
        page,
        pageSize,
        searchQuery,
        roleFilter,
        bannedFilter,
        sortBy,
      ),
    staleTime: 30000,
  });

  // 회원 상세 조회
  const { data: userDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["userDetail", selectedUser?.id],
    queryFn: () => api.getUserDetail(selectedUser?.id),
    enabled: !!selectedUser?.id && showDetailModal,
  });

  // 회원 상태 업데이트
  const statusMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: api.UserStatusUpdate;
    }) => api.updateUserStatus(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
      setShowStatusModal(false);
      setSelectedUser(null);
      alert("회원 상태가 업데이트되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "회원 상태 업데이트에 실패했습니다.");
    },
  });

  // 회원 정보 업데이트
  const userInfoMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      api.updateUserInfo(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userDetail"] });
      setIsEditingUsername(false);
      alert("회원 정보가 업데이트되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "회원 정보 업데이트에 실패했습니다.");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleViewDetail = (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
    setIsEditingUsername(false);
  };

  const handleEditStatus = (user: any) => {
    setSelectedUser(user);
    setStatusFormData({
      is_banned: user.is_banned || false,
      role: user.role || "USER",
      ban_reason: "",
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      statusMutation.mutate({ userId: selectedUser.id, data: statusFormData });
    }
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
    setEditUsername(
      userDetail?.user_info?.username || userDetail?.user_info?.name || "",
    );
  };

  const handleSaveUsername = () => {
    if (selectedUser && editUsername.trim()) {
      userInfoMutation.mutate({
        userId: selectedUser.id,
        data: { username: editUsername.trim() },
      });
    }
  };

  const handleCancelEditUsername = () => {
    setIsEditingUsername(false);
    setEditUsername("");
  };

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize);

  // Role 배지 색상
  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return { bg: colors.purple[600] + "20", color: colors.purple[600] };
      case "ADMIN":
        return { bg: colors.blue[600] + "20", color: colors.blue[600] };
      default:
        return { bg: colors.gray[200], color: colors.gray[600] };
    }
  };

  // Role 한글 변환
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "최고관리자";
      case "ADMIN":
        return "관리자";
      default:
        return "일반회원";
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>회원 관리</h1>
      </div>

      {/* 검색 및 필터 영역 */}
      <div style={styles.searchContainer}>
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          <input
            type="text"
            placeholder="이름 또는 이메일로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setSearchQuery(searchInput);
                setPage(1);
              }
            }}
            style={{
              ...styles.searchInput,
              flex: "1 1 auto",
              minWidth: "200px",
            }}
          />

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "8px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
              minWidth: "140px",
              width: "auto",
            }}
          >
            <option value="">전체 역할</option>
            <option value="USER">일반회원</option>
            <option value="ADMIN">관리자</option>
            <option value="SUPER_ADMIN">최고관리자</option>
          </select>

          <select
            value={bannedFilter === undefined ? "" : bannedFilter.toString()}
            onChange={(e) => {
              setBannedFilter(
                e.target.value === "" ? undefined : e.target.value === "true",
              );
              setPage(1);
            }}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "8px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
              minWidth: "120px",
              width: "auto",
            }}
          >
            <option value="">전체 상태</option>
            <option value="false">정상</option>
            <option value="true">차단됨</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "8px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
              minWidth: "170px",
              width: "auto",
            }}
          >
            <option value="created_at_desc">가입일 최신순</option>
            <option value="created_at_asc">가입일 오래된순</option>
            <option value="last_login_desc">최근 로그인순</option>
            <option value="points_desc">포인트 높은순</option>
          </select>

          <button type="submit" style={styles.searchButton}>
            검색
          </button>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "14px", color: colors.gray[600] }}>
              페이지당
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                backgroundColor: colors.white,
                cursor: "pointer",
                outline: "none",
                width: "auto",
              }}
            >
              <option value="10">10개</option>
              <option value="20">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
          </div>
        </form>
      </div>

      {/* 회원 목록 테이블 */}
      <div style={styles.tableContainer}>
        {data?.users?.length === 0 ? (
          <EmptyState message="검색 결과가 없습니다." icon="" />
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>이름</th>
                    <th style={styles.th}>이메일</th>
                    <th style={styles.th}>가입</th>
                    <th style={styles.th}>역할</th>
                    <th style={styles.th}>상태</th>
                    <th style={styles.th}>포인트</th>
                    <th style={styles.th}>가입일</th>
                    <th style={styles.th}>최근 로그인</th>
                    <th style={styles.th}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.map((user: any) => (
                    <tr
                      key={user.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === user.id ? styles.tableRowHover : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(user.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>{user.id}</td>
                      <td style={styles.td}>{user.username || user.name}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: "500",
                            backgroundColor:
                              user.register_type === "kakao"
                                ? "#FEE500"
                                : user.register_type === "apple"
                                ? colors.gray[900]
                                : user.register_type === "google"
                                ? "#4285F4"
                                : colors.blue[100],
                            color:
                              user.register_type === "kakao"
                                ? "#000000"
                                : user.register_type === "apple"
                                ? colors.white
                                : user.register_type === "google"
                                ? colors.white
                                : colors.blue[600],
                            display: "inline-block",
                          }}
                        >
                          {user.register_type === "kakao"
                            ? "카카오"
                            : user.register_type === "apple"
                            ? "애플"
                            : user.register_type === "google"
                            ? "구글"
                            : user.register_type === "email"
                            ? "이메일"
                            : user.register_type || "일반"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            backgroundColor: getRoleColor(user.role).bg,
                            color: getRoleColor(user.role).color,
                            fontWeight: "600",
                            display: "inline-block",
                          }}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            backgroundColor: user.is_banned
                              ? colors.error + "20"
                              : colors.success + "20",
                            color: user.is_banned
                              ? colors.error
                              : colors.success,
                            fontWeight: "500",
                            display: "inline-block",
                          }}
                        >
                          {user.is_banned ? "차단됨" : "정상"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {user.points?.toLocaleString() || 0}
                      </td>
                      <td style={styles.td}>
                        {new Date(user.created_at).toLocaleDateString("ko-KR")}
                      </td>
                      <td style={styles.td}>
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString(
                              "ko-KR",
                            )
                          : "-"}
                      </td>
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            style={{
                              ...styles.actionButton,
                              padding: "5px 10px",
                              fontSize: "12px",
                            }}
                            onClick={() => handleViewDetail(user)}
                          >
                            상세
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              backgroundColor: colors.blue[500],
                              color: colors.white,
                              padding: "5px 10px",
                              fontSize: "12px",
                            }}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowActivityModal(true);
                            }}
                          >
                            활동
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton,
                              padding: "5px 10px",
                              fontSize: "12px",
                            }}
                            onClick={() => handleEditStatus(user)}
                          >
                            상태변경
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* 회원 상세 모달 */}
      {showDetailModal && selectedUser && (
        <div style={styles.modal} onClick={() => setShowDetailModal(false)}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>
                회원 상세 정보
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                  color: colors.gray[600],
                  lineHeight: "1",
                }}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              {isLoadingDetail ? (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <LoadingSpinner />
                </div>
              ) : userDetail?.user_info ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div style={styles.detailSection}>
                    <h3 style={styles.detailSectionTitle}>기본 정보</h3>
                    <div style={styles.detailGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>ID</span>
                        <span style={styles.detailValue}>
                          {userDetail.user_info.id}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>이름</span>
                        {isEditingUsername ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              alignItems: "center",
                              marginTop: "2px",
                            }}
                          >
                            <input
                              type="text"
                              value={editUsername}
                              onChange={(e) => setEditUsername(e.target.value)}
                              style={{
                                padding: "5px 8px",
                                border: `1px solid ${colors.blue[500]}`,
                                borderRadius: "4px",
                                fontSize: "14px",
                                minWidth: "120px",
                                maxWidth: "200px",
                                outline: "none",
                                backgroundColor: colors.white,
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveUsername();
                                } else if (e.key === "Escape") {
                                  handleCancelEditUsername();
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={handleSaveUsername}
                              disabled={userInfoMutation.isPending}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: colors.blue[600],
                                color: colors.white,
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: userInfoMutation.isPending
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: userInfoMutation.isPending ? 0.6 : 1,
                                transition: "all 0.2s",
                              }}
                            >
                              {userInfoMutation.isPending ? "저장중" : "저장"}
                            </button>
                            <button
                              onClick={handleCancelEditUsername}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: colors.gray[100],
                                color: colors.gray[600],
                                border: `1px solid ${colors.gray[300]}`,
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={styles.detailValue}>
                              {userDetail.user_info.username ||
                                userDetail.user_info.name}
                            </span>
                            <button
                              onClick={handleEditUsername}
                              style={{
                                padding: "3px 8px",
                                backgroundColor: "transparent",
                                color: colors.blue[600],
                                border: `1px solid ${colors.blue[200]}`,
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: "500",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "3px",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  colors.blue[50];
                                e.currentTarget.style.borderColor =
                                  colors.blue[500];
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.borderColor =
                                  colors.blue[200];
                              }}
                              title="이름 수정"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              수정
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>이메일</span>
                        <span style={styles.detailValue}>
                          {userDetail.user_info.email}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>가입 방법</span>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor:
                              userDetail.user_info.register_type === "kakao"
                                ? "#FEE500"
                                : userDetail.user_info.register_type === "apple"
                                ? colors.gray[900]
                                : userDetail.user_info.register_type ===
                                  "google"
                                ? "#4285F4"
                                : colors.blue[100],
                            color:
                              userDetail.user_info.register_type === "kakao"
                                ? "#000000"
                                : userDetail.user_info.register_type === "apple"
                                ? colors.white
                                : userDetail.user_info.register_type ===
                                  "google"
                                ? colors.white
                                : colors.blue[600],
                          }}
                        >
                          {userDetail.user_info.register_type === "kakao"
                            ? "카카오"
                            : userDetail.user_info.register_type === "apple"
                            ? "애플"
                            : userDetail.user_info.register_type === "google"
                            ? "구글"
                            : userDetail.user_info.register_type === "email"
                            ? "이메일"
                            : userDetail.user_info.register_type || "일반"}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>역할</span>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            backgroundColor: getRoleColor(
                              userDetail.user_info.role,
                            ).bg,
                            color: getRoleColor(userDetail.user_info.role)
                              .color,
                            fontWeight: "500",
                          }}
                        >
                          {getRoleLabel(userDetail.user_info.role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.detailSection}>
                    <h3 style={styles.detailSectionTitle}>활동 정보</h3>
                    <div style={styles.detailGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>포인트</span>
                        <span style={styles.detailValue}>
                          {userDetail.user_info.points?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>가입일</span>
                        <span style={styles.detailValue}>
                          {new Date(
                            userDetail.user_info.created_at,
                          ).toLocaleString("ko-KR")}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>최근 로그인</span>
                        <span style={styles.detailValue}>
                          {userDetail.user_info.last_login_at
                            ? new Date(
                                userDetail.user_info.last_login_at,
                              ).toLocaleString("ko-KR")
                            : "없음"}
                        </span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>상태</span>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            backgroundColor: userDetail.user_info.is_banned
                              ? colors.error + "20"
                              : colors.success + "20",
                            color: userDetail.user_info.is_banned
                              ? colors.error
                              : colors.success,
                          }}
                        >
                          {userDetail.user_info.is_banned ? "차단됨" : "정상"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {userDetail.user_info.is_banned &&
                    userDetail.user_info.ban_reason && (
                      <div style={styles.detailSection}>
                        <h3 style={styles.detailSectionTitle}>차단 정보</h3>
                        <div
                          style={{
                            padding: "12px",
                            backgroundColor: colors.error + "10",
                            borderRadius: "8px",
                            border: `1px solid ${colors.error}30`,
                          }}
                        >
                          <p style={{ margin: 0, color: colors.gray[700] }}>
                            {userDetail.user_info.ban_reason}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: colors.gray[500],
                  }}
                >
                  사용자 정보를 불러올 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 회원 상태 변경 모달 */}
      {showStatusModal && selectedUser && (
        <div style={styles.modal} onClick={() => setShowStatusModal(false)}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleStatusSubmit}>
              <div
                style={{
                  ...styles.modalHeader,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${colors.gray[200]}`,
                }}
              >
                <h2 style={{ ...styles.modalTitle, margin: 0 }}>
                  회원 상태 변경
                </h2>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    padding: "4px",
                    color: colors.gray[600],
                    lineHeight: "1",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>회원 정보</label>
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: colors.gray[50],
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>이름:</strong>{" "}
                      {selectedUser.username || selectedUser.name}
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>이메일:</strong> {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>역할</label>
                  <select
                    value={statusFormData.role}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        role: e.target.value as any,
                      })
                    }
                    style={styles.select}
                  >
                    <option value="USER">일반회원</option>
                    <option value="ADMIN">관리자</option>
                    <option value="SUPER_ADMIN">최고관리자</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <input
                      type="checkbox"
                      checked={statusFormData.is_banned}
                      onChange={(e) =>
                        setStatusFormData({
                          ...statusFormData,
                          is_banned: e.target.checked,
                        })
                      }
                      style={{ marginRight: "8px" }}
                    />
                    계정 차단
                  </label>
                </div>

                {statusFormData.is_banned && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>차단 사유</label>
                    <textarea
                      value={statusFormData.ban_reason}
                      onChange={(e) =>
                        setStatusFormData({
                          ...statusFormData,
                          ban_reason: e.target.value,
                        })
                      }
                      placeholder="차단 사유를 입력하세요"
                      style={{
                        ...styles.textarea,
                        minHeight: "100px",
                      }}
                      required
                    />
                  </div>
                )}
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  style={styles.cancelButton}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending ? "처리 중..." : "변경하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 활동 모달 */}
      {showActivityModal && selectedUser && (
        <div style={styles.modal} onClick={() => setShowActivityModal(false)}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "700px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>
                사용자 활동 정보
              </h2>
              <button
                onClick={() => setShowActivityModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                  color: colors.gray[600],
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                ...styles.modalBody,
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <AuthorDetailContent
                authorId={selectedUser.id}
                authorName={
                  selectedUser.username ||
                  selectedUser.name ||
                  selectedUser.email
                }
              />
            </div>
            <div
              style={{
                ...styles.modalFooter,
                flexShrink: 0,
                borderTop: `1px solid ${colors.gray[200]}`,
                padding: "16px 20px",
              }}
            >
              <button
                onClick={() => setShowActivityModal(false)}
                style={styles.cancelButton}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Calendar Management Component
const CalendarManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    color: "#6366F1", // 기본 색상
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("event_date_desc");
  const [filterDateStart, setFilterDateStart] = useState("");
  const [filterDateEnd, setFilterDateEnd] = useState("");
  const [clickedDate, setClickedDate] = useState<string | null>(null); // 캘린더에서 클릭한 날짜

  // 기본값으로 이번 달의 시작과 끝 날짜 설정
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(
    firstDay.toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(lastDay.toISOString().split("T")[0]);

  const queryClient = useQueryClient();

  // 자동 저장 기능 - 폼 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (isModalOpen && !editingEvent) {
      const draftData = {
        formData,
        htmlContent,
        selectedDate,
        selectedTime,
        timestamp: Date.now(),
      };
      localStorage.setItem("calendarFormDraft", JSON.stringify(draftData));
    }
  }, [
    formData,
    htmlContent,
    selectedDate,
    selectedTime,
    isModalOpen,
    editingEvent,
  ]);

  // Update date ranges when current month changes
  useEffect(() => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    setStartDate(firstDay.toISOString().split("T")[0]);
    setEndDate(lastDay.toISOString().split("T")[0]);
  }, [currentDate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["calendar", startDate, endDate],
    queryFn: () => {
      // 날짜가 둘 다 있을 때만 API 호출
      if (startDate && endDate) {
        return api.getCalendarEvents(startDate, endDate);
      }
      // 날짜가 없으면 빈 결과 반환
      return Promise.resolve({ events: [], total_count: 0 });
    },
    enabled: !!(startDate && endDate), // 날짜가 둘 다 있을 때만 쿼리 활성화
  });

  const createMutation = useMutation({
    mutationFn: api.createCalendarEvent,
    onSuccess: async () => {
      // 모든 calendar 관련 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
      // 현재 표시 중인 날짜 범위에 대한 쿼리도 강제 새로고침
      await queryClient.refetchQueries({
        queryKey: ["calendar", startDate, endDate],
      });
      alert("일정이 성공적으로 등록되었습니다.");
      localStorage.removeItem("calendarFormDraft"); // 성공 시 임시 저장 삭제
      closeModal();
    },
    onError: (error: any) => {
      alert(error.message || "일정 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: api.CalendarEventData }) =>
      api.updateCalendarEvent(id, data),
    onSuccess: async () => {
      // 모든 calendar 관련 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
      // 현재 표시 중인 날짜 범위에 대한 쿼리도 강제 새로고침
      await queryClient.refetchQueries({
        queryKey: ["calendar", startDate, endDate],
      });
      alert("일정이 성공적으로 수정되었습니다.");
      localStorage.removeItem("calendarFormDraft"); // 성공 시 임시 저장 삭제
      closeModal();
    },
    onError: (error: any) => {
      alert(error.message || "일정 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCalendarEvent,
    onSuccess: async () => {
      // 모든 calendar 관련 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
      // 현재 표시 중인 날짜 범위에 대한 쿼리도 강제 새로고침
      await queryClient.refetchQueries({
        queryKey: ["calendar", startDate, endDate],
      });
      alert("일정이 성공적으로 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "일정 삭제에 실패했습니다.");
    },
  });

  const openModal = (event?: any) => {
    if (event) {
      setEditingEvent(event);
      // Convert ISO date to datetime-local format
      const eventDate = event.event_date
        ? new Date(event.event_date).toISOString().slice(0, 16)
        : "";
      // 날짜와 시간 분리 (KST 시간대 고려)
      if (event.event_date) {
        // API에서 받은 UTC 시간을 Date 객체로 변환
        const dateObj = new Date(event.event_date);

        // toLocaleString을 사용하여 KST로 변환된 날짜/시간 추출
        const kstString = dateObj.toLocaleString("en-CA", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // 날짜와 시간 분리 (YYYY-MM-DD, HH:mm 형식)
        const [datePart, timePart] = kstString.split(", ");
        setSelectedDate(datePart);
        setSelectedTime(timePart);
      }
      setFormData({
        title: event.title || "",
        event_date: eventDate,
        color: event.color || "#6366F1",
      });
      // Convert content to HTML for editing
      if (Array.isArray(event.content)) {
        const html = convertContentBlocksToHtml(event.content);
        setHtmlContent(html);
      } else if (typeof event.content === "string") {
        setHtmlContent(`<p>${event.content}</p>`);
      } else {
        setHtmlContent("");
      }
    } else {
      setEditingEvent(null);

      // 임시 저장된 데이터 확인 및 복원
      const draftData = localStorage.getItem("calendarFormDraft");
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          // 24시간 이내의 데이터인지 확인
          if (
            draft.timestamp &&
            Date.now() - draft.timestamp < 24 * 60 * 60 * 1000
          ) {
            const confirmRestore = window.confirm(
              "이전에 작성 중이던 내용이 있습니다. 복원하시겠습니까?",
            );
            if (confirmRestore) {
              setFormData(
                draft.formData || {
                  title: "",
                  event_date: "",
                  color: "#6366F1",
                },
              );
              setHtmlContent(draft.htmlContent || "");
              setSelectedDate(draft.selectedDate || "");
              setSelectedTime(draft.selectedTime || "09:00");
              setIsModalOpen(true);
              return;
            } else {
              localStorage.removeItem("calendarFormDraft");
            }
          } else {
            // 24시간이 지난 데이터는 삭제
            localStorage.removeItem("calendarFormDraft");
          }
        } catch (e) {
          console.error("Failed to restore draft:", e);
          localStorage.removeItem("calendarFormDraft");
        }
      }

      // 클릭한 날짜가 있으면 그 날짜를, 없으면 오늘 날짜를 기본값으로 설정
      const defaultDate = clickedDate || new Date().toISOString().split("T")[0];
      setSelectedDate(defaultDate);
      setSelectedTime("09:00");
      setFormData({
        title: "",
        event_date: "",
        color: "#6366F1",
      });
      setHtmlContent("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setHtmlContent("");
    setSelectedDate("");
    setSelectedTime("09:00");
    setFormData({
      title: "",
      event_date: "",
      color: "#6366F1",
    });
  };

  // Old content block helper functions removed - no longer needed with RichEditor

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert("제목은 필수입니다.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("날짜와 시간을 모두 선택해주세요.");
      return;
    }

    // 날짜와 시간을 합쳐서 event_date 설정
    const combinedDateTime = `${selectedDate}T${selectedTime}:00`; // 초 추가

    // Convert HTML to content blocks - 빈 내용도 허용
    const contentBlocks =
      !htmlContent || htmlContent === "<p><br></p>" || htmlContent.trim() === ""
        ? []
        : convertHtmlToContentBlocks(htmlContent);

    // 문제 분석:
    // - 사용자가 18시 입력 → 서버에 09시로 저장됨 → 표시할 때 09시로 나옴
    // - 서버가 받은 시간을 그대로 저장하고, 그대로 반환하는 것으로 보임
    // - 해결: 입력 시간에 +9시간을 더해서 전송

    const localDate = new Date(combinedDateTime);
    // UTC로 변환하지 않고, KST 시간에 9시간을 더해서 전송
    // 18시 입력 → 27시(익일 03시)로 전송 → 서버가 27시로 저장 → 표시할 때 27-9=18시
    localDate.setHours(localDate.getHours() + 9);
    const eventDate = localDate.toISOString();

    console.log("=== 캘린더 시간 전송 (보정) ===");
    console.log("사용자 입력 (KST):", combinedDateTime);
    console.log("+9시간 보정 후:", localDate.toString());
    console.log("서버 전송 (ISO):", eventDate);
    console.log("===========================");

    const eventData: api.CalendarEventData = {
      title: formData.title,
      content: contentBlocks,
      event_date: eventDate,
      color: formData.color,
    };

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: eventData });
    } else {
      createMutation.mutate(eventData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  // Format date for display (UTC를 KST로 변환)
  const formatEventDate = (dateString: string) => {
    if (!dateString) return "-";

    // 서버에서 UTC 시간을 받음 (Z 접미사 또는 +00:00)
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }

    // KST로 변환하여 표시
    return date.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Calendar helper functions
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );
  const weeks = [];
  for (let i = 0; i < 5; i++) {
    weeks.push(calendarDays.slice(i * 7, (i + 1) * 7));
  }

  // Filter and sort events
  const getFilteredAndSortedEvents = () => {
    if (!data?.events) return [];

    let filteredEvents = [...data.events];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter((event: any) => {
        const titleMatch = event.title?.toLowerCase().includes(query);
        const authorMatch = event.author_name?.toLowerCase().includes(query);
        const contentMatch = event.content?.some(
          (block: any) =>
            block.type === "text" &&
            block.content?.toLowerCase().includes(query),
        );
        return titleMatch || authorMatch || contentMatch;
      });
    }

    // Apply date range filter
    if (filterDateStart && filterDateEnd) {
      const startDate = new Date(filterDateStart + "T00:00:00");
      const endDate = new Date(filterDateEnd + "T23:59:59");

      filteredEvents = filteredEvents.filter((event: any) => {
        const eventDate = new Date(event.event_date);
        // 로컬 날짜로 비교
        const eventLocalDate = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
          eventDate.getHours(),
          eventDate.getMinutes(),
        );
        return eventLocalDate >= startDate && eventLocalDate <= endDate;
      });
    }

    // Apply sorting
    filteredEvents.sort((a: any, b: any) => {
      switch (sortBy) {
        case "event_date_asc":
          return (
            new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
          );
        case "event_date_desc":
          return (
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
          );
        case "created_at_asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "created_at_desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "title_asc":
          return a.title.localeCompare(b.title);
        case "title_desc":
          return b.title.localeCompare(a.title);
        default:
          return (
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
          );
      }
    });

    return filteredEvents;
  };

  const filteredEvents = getFilteredAndSortedEvents();

  // Build events map for calendar display - use ALL events for calendar dots, not filtered
  const eventsMap: { [key: string]: any[] } = {};
  if (data?.events) {
    data.events.forEach((event: any) => {
      const eventDate = new Date(event.event_date);

      // KST 시간대로 날짜 변환
      const kstDateString = eventDate.toLocaleString("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // YYYY-MM-DD 형식으로 dateKey 생성
      const dateKey = kstDateString.split(",")[0]; // en-CA locale은 YYYY-MM-DD 형식 반환

      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }
      eventsMap[dateKey].push(event);
    });
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    console.error("Calendar API Error:", error);
    return (
      <div style={styles.errorContainer}>
        <p>데이터를 불러오는데 실패했습니다.</p>
        <p
          style={{
            fontSize: "14px",
            color: colors.gray[600],
            marginTop: "8px",
          }}
        >
          {(error as any)?.message || "알 수 없는 오류가 발생했습니다."}
        </p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["calendar"] })
          }
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            backgroundColor: colors.primary,
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>캘린더 관리</h1>
        <button style={styles.addButton} onClick={() => openModal()}>
          <span>+</span> 일정 추가
        </button>
      </div>

      {/* Calendar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: window.innerWidth < 768 ? "16px" : "24px",
          marginBottom: "32px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Calendar Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() =>
                setCurrentDate(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
              style={{
                padding: "8px",
                backgroundColor: "transparent",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              이전
            </button>
            <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={() =>
                setCurrentDate(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
              style={{
                padding: "8px",
                backgroundColor: "transparent",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              다음
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            style={{
              padding: "8px 16px",
              backgroundColor: colors.gray[200],
              color: colors.gray[700],
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            오늘
          </button>
        </div>

        {/* Weekday Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0",
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: "8px",
            marginBottom: "8px",
          }}
        >
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontSize: window.innerWidth < 768 ? "12px" : "14px",
                fontWeight: "500",
                color: index === 0 ? "#EC4899" : "#6B7280",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0",
                borderBottom: weekIndex < 4 ? "1px solid #E5E7EB" : "none",
              }}
            >
              {week.map((date, dateIndex) => {
                const isCurrentMonth =
                  date.getMonth() === currentDate.getMonth();
                const isToday =
                  date.toDateString() === new Date().toDateString();
                const isSunday = date.getDay() === 0;
                const dateKey = `${date.getFullYear()}-${String(
                  date.getMonth() + 1,
                ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                const dayEvents = eventsMap[dateKey] || [];
                const isClicked = dateKey === clickedDate;

                return (
                  <div
                    key={dateIndex}
                    style={{
                      minHeight: window.innerWidth < 768 ? "40px" : "80px",
                      padding: window.innerWidth < 768 ? "2px" : "8px",
                      position: "relative",
                      backgroundColor: isClicked
                        ? "#E0E7FF"
                        : isToday
                        ? "#F3F4F6"
                        : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      borderRight: dateIndex < 6 ? "1px solid #E5E7EB" : "none",
                      border: isClicked ? "2px solid #6366F1" : "none",
                    }}
                    onClick={() => {
                      // 로컬 시간대를 고려한 날짜 문자열 생성
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0",
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const clickedDateStr = `${year}-${month}-${day}`;

                      // 같은 날짜를 다시 클릭하면 필터 해제
                      if (clickedDate === clickedDateStr) {
                        setClickedDate(null);
                        setFilterDateStart("");
                        setFilterDateEnd("");
                      } else {
                        setClickedDate(clickedDateStr);
                        setFilterDateStart(clickedDateStr);
                        setFilterDateEnd(clickedDateStr);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!isClicked) {
                        e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }
                    }}
                    onMouseLeave={(e) => {
                      // 마우스가 떠났을 때 원래 색상으로 복원
                      const originalColor = isClicked
                        ? "#E0E7FF"
                        : isToday
                        ? "#F3F4F6"
                        : "transparent";
                      e.currentTarget.style.backgroundColor = originalColor;
                    }}
                  >
                    <div
                      style={{
                        fontSize: window.innerWidth < 768 ? "12px" : "14px",
                        fontWeight: isToday ? "600" : "400",
                        color: !isCurrentMonth
                          ? "#D1D5DB"
                          : isSunday
                          ? "#EC4899"
                          : "#374151",
                        marginBottom: window.innerWidth < 768 ? "2px" : "4px",
                      }}
                    >
                      {date.getDate()}
                    </div>
                    {dayEvents.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          flexWrap: "wrap",
                          justifyContent:
                            window.innerWidth < 768 ? "center" : "flex-start",
                        }}
                      >
                        {dayEvents
                          .slice(0, window.innerWidth < 768 ? 3 : 5)
                          .map((event, idx) => (
                            <div
                              key={event.id}
                              style={{
                                width: window.innerWidth < 768 ? "8px" : "10px",
                                height:
                                  window.innerWidth < 768 ? "8px" : "10px",
                                borderRadius: "50%",
                                backgroundColor: event.color || "#6366F1",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(event);
                              }}
                              title={event.title}
                            />
                          ))}
                        {dayEvents.length > (window.innerWidth < 768 ? 3 : 5) &&
                          window.innerWidth >= 768 && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#6B7280",
                                lineHeight: "10px",
                              }}
                            >
                              +{dayEvents.length - 5}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          padding: window.innerWidth < 768 ? "16px" : "20px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: "16px",
            flexWrap: "wrap" as const,
            alignItems: window.innerWidth < 768 ? "stretch" : "flex-end",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              flex: "1 1 300px",
              minWidth: window.innerWidth < 768 ? "100%" : "200px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: "1" }}>
              <label
                style={{
                  ...styles.label,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                검색
              </label>
              <input
                type="text"
                placeholder="제목으로 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(searchInput);
                  }
                }}
                style={styles.input}
              />
            </div>
            <button
              onClick={() => setSearchQuery(searchInput)}
              style={{
                padding: "12px 20px",
                backgroundColor: colors.primary,
                color: colors.white,
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                height: "fit-content",
              }}
            >
              검색
            </button>
          </div>

          {/* Date Range Filter */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <div>
              <label
                style={{
                  ...styles.label,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                시작일
              </label>
              <input
                type="date"
                value={filterDateStart}
                onChange={(e) => setFilterDateStart(e.target.value)}
                style={{ ...styles.input, width: "auto" }}
              />
            </div>
            <span style={{ marginBottom: "8px" }}>~</span>
            <div>
              <label
                style={{
                  ...styles.label,
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                종료일
              </label>
              <input
                type="date"
                value={filterDateEnd}
                onChange={(e) => setFilterDateEnd(e.target.value)}
                style={{ ...styles.input, width: "auto" }}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div style={{ minWidth: "200px" }}>
            <label
              style={{ ...styles.label, marginBottom: "8px", display: "block" }}
            >
              정렬
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.input}
            >
              <option value="event_date_desc">일정 날짜 (최신순)</option>
              <option value="event_date_asc">일정 날짜 (오래된순)</option>
              <option value="created_at_desc">작성일 (최신순)</option>
              <option value="created_at_asc">작성일 (오래된순)</option>
              <option value="title_asc">제목 (가나다순)</option>
              <option value="title_desc">제목 (가나다역순)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}
          >
            <button
              onClick={() => {
                // Apply filters to the calendar view
                if (filterDateStart && filterDateEnd) {
                  setStartDate(filterDateStart);
                  setEndDate(filterDateEnd);
                }
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: colors.primary,
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              검색
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterDateStart("");
                setFilterDateEnd("");
                setSortBy("event_date_desc");
                setClickedDate(null);
                // Reset to current month
                const today = new Date();
                const firstDay = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  1,
                );
                const lastDay = new Date(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  0,
                );
                setStartDate(firstDay.toISOString().split("T")[0]);
                setEndDate(lastDay.toISOString().split("T")[0]);
                setCurrentDate(today);
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: colors.gray[300],
                color: colors.gray[700],
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              초기화
            </button>

            {/* Quick date range buttons */}
            <div style={{ display: "flex", gap: "4px", marginLeft: "16px" }}>
              <button
                onClick={() => {
                  const today = new Date();
                  setFilterDateStart(today.toISOString().split("T")[0]);
                  setFilterDateEnd(today.toISOString().split("T")[0]);
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: colors.gray[100],
                  color: colors.gray[700],
                  border: "1px solid " + colors.gray[300],
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                오늘
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const weekStart = new Date(today);
                  weekStart.setDate(today.getDate() - today.getDay());
                  const weekEnd = new Date(today);
                  weekEnd.setDate(today.getDate() + (6 - today.getDay()));
                  setFilterDateStart(weekStart.toISOString().split("T")[0]);
                  setFilterDateEnd(weekEnd.toISOString().split("T")[0]);
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: colors.gray[100],
                  color: colors.gray[700],
                  border: "1px solid " + colors.gray[300],
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                이번 주
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const monthStart = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1,
                  );
                  const monthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0,
                  );
                  setFilterDateStart(monthStart.toISOString().split("T")[0]);
                  setFilterDateEnd(monthEnd.toISOString().split("T")[0]);
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: colors.gray[100],
                  color: colors.gray[700],
                  border: "1px solid " + colors.gray[300],
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                이번 달
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const nextMonthStart = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    1,
                  );
                  const nextMonthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth() + 2,
                    0,
                  );
                  setFilterDateStart(
                    nextMonthStart.toISOString().split("T")[0],
                  );
                  setFilterDateEnd(nextMonthEnd.toISOString().split("T")[0]);
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: colors.gray[100],
                  color: colors.gray[700],
                  border: "1px solid " + colors.gray[300],
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                다음 달
              </button>
            </div>

            {/* 초기화 버튼 */}
            <button
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setFilterDateStart("");
                setFilterDateEnd("");
                setSortBy("event_date_desc");
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: colors.gray[200],
                color: colors.gray[700],
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "4px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {!data?.events || data.events.length === 0 ? (
          <EmptyState message="등록된 일정이 없습니다." icon="" />
        ) : filteredEvents.length === 0 ? (
          <EmptyState message="검색 결과가 없습니다." icon="" />
        ) : (
          <>
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: "#F9FAFB",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: colors.gray[700],
                  fontWeight: "500",
                }}
              >
                총 {filteredEvents.length}개의 일정
                {clickedDate && (
                  <span style={{ marginLeft: "12px", color: colors.primary }}>
                    ({new Date(clickedDate).toLocaleDateString("ko-KR")}{" "}
                    필터링됨)
                  </span>
                )}
              </div>
            </div>

            {/* 모바일 카드 뷰 */}
            {window.innerWidth < 768 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {filteredEvents.map((event: any) => (
                  <div
                    key={event.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      borderLeft: `4px solid ${event.color || "#6366F1"}`,
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#1F2937",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: event.color || "#6366F1",
                            flexShrink: 0,
                          }}
                        />
                        {event.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <p style={{ fontSize: "14px", color: "#6B7280" }}>
                          {formatEventDate(event.event_date)}
                        </p>
                        <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
                          작성자: {event.author_name || "-"}
                        </p>
                        <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
                          작성일:{" "}
                          {new Date(event.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() => openModal(event)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#E5E7EB",
                          color: "#374151",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#FEE2E2",
                          color: "#DC2626",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 데스크탑 테이블 뷰 */
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>제목</th>
                      <th style={styles.th}>일정</th>
                      <th style={styles.th}>작성자</th>
                      <th style={styles.th}>작성일</th>
                      <th style={styles.th}>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event: any) => (
                      <tr
                        key={event.id}
                        style={{
                          ...styles.tableRow,
                          ...(hoveredRow === event.id
                            ? styles.tableRowHover
                            : {}),
                        }}
                        onMouseEnter={() => setHoveredRow(event.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={styles.td}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                backgroundColor: event.color || "#6366F1",
                                flexShrink: 0,
                              }}
                            />
                            {event.title}
                          </div>
                        </td>
                        <td style={styles.td}>
                          {formatEventDate(event.event_date)}
                        </td>
                        <td style={styles.td}>{event.author_name || "-"}</td>
                        <td style={styles.td}>
                          {new Date(event.created_at).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.editButton,
                              }}
                              onClick={() => openModal(event)}
                            >
                              수정
                            </button>
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.deleteButton,
                              }}
                              onClick={() => handleDelete(event.id)}
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ ...styles.modalHeader, position: "relative" }}>
              <h2 style={styles.modalTitle}>
                {editingEvent ? "일정 수정" : "일정 추가"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const hasContent =
                    formData.title ||
                    htmlContent ||
                    selectedDate ||
                    (selectedTime && selectedTime !== "09:00");
                  if (hasContent && !editingEvent) {
                    const result = window.confirm(
                      "작성 중인 내용을 임시 저장하시겠습니까?\n\n확인: 임시 저장 후 닫기\n취소: 저장하지 않고 닫기",
                    );
                    if (result) {
                      // 임시 저장 후 닫기
                      const draftData = {
                        formData,
                        htmlContent,
                        selectedDate,
                        selectedTime,
                        timestamp: Date.now(),
                      };
                      localStorage.setItem(
                        "calendarFormDraft",
                        JSON.stringify(draftData),
                      );
                      alert(
                        "임시 저장되었습니다. 다음에 일정 추가를 누르면 복원됩니다.",
                      );
                      closeModal();
                    } else {
                      // 저장하지 않고 닫기
                      if (
                        window.confirm(
                          "임시 저장하지 않고 닫으시겠습니까? 작성 중인 내용이 모두 사라집니다.",
                        )
                      ) {
                        localStorage.removeItem("calendarFormDraft");
                        closeModal();
                      }
                    }
                  } else {
                    closeModal();
                    localStorage.removeItem("calendarFormDraft");
                  }
                }}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  fontSize: "28px",
                  fontWeight: "300",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "0",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";
                }}
                title="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>제목 *</label>
                  <input
                    style={styles.input}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="일정 제목을 입력하세요"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>일정 날짜 *</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <input
                      type="date"
                      style={{ ...styles.input, flex: 1 }}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        if (e.target.value && selectedTime) {
                          setFormData({
                            ...formData,
                            event_date: `${e.target.value}T${selectedTime}`,
                          });
                        }
                      }}
                      required
                    />
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const dateStr = today.toISOString().split("T")[0];
                          setSelectedDate(dateStr);
                          if (selectedTime) {
                            setFormData({
                              ...formData,
                              event_date: `${dateStr}T${selectedTime}`,
                            });
                          }
                        }}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#E5E7EB",
                          color: "#374151",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        오늘
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          const dateStr = tomorrow.toISOString().split("T")[0];
                          setSelectedDate(dateStr);
                          if (selectedTime) {
                            setFormData({
                              ...formData,
                              event_date: `${dateStr}T${selectedTime}`,
                            });
                          }
                        }}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#E5E7EB",
                          color: "#374151",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        내일
                      </button>
                    </div>
                  </div>

                  <label style={{ ...styles.label, marginTop: "12px" }}>
                    일정 시간
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="time"
                      style={{ ...styles.input, width: "150px" }}
                      value={selectedTime}
                      onChange={(e) => {
                        setSelectedTime(e.target.value);
                        if (selectedDate && e.target.value) {
                          setFormData({
                            ...formData,
                            event_date: `${selectedDate}T${e.target.value}`,
                          });
                        }
                      }}
                    />
                    <div
                      style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
                    >
                      {[
                        "09:00",
                        "10:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "18:00",
                      ].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setSelectedTime(time);
                            if (selectedDate) {
                              setFormData({
                                ...formData,
                                event_date: `${selectedDate}T${time}`,
                              });
                            }
                          }}
                          style={{
                            padding: "6px 10px",
                            backgroundColor:
                              selectedTime === time
                                ? colors.primary
                                : "#F3F4F6",
                            color: selectedTime === time ? "white" : "#374151",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>캘린더 표시 색상</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* 색상 프리셋 */}
                    {[
                      { color: "#6366F1", name: "남색 (기본)" },
                      { color: "#EF4444", name: "빨간색" },
                      { color: "#F59E0B", name: "주황색" },
                      { color: "#10B981", name: "초록색" },
                      { color: "#3B82F6", name: "파란색" },
                      { color: "#7B2FFF", name: "보라색" },
                      { color: "#EC4899", name: "분홍색" },
                      { color: "#8B5CF6", name: "자주색" },
                      { color: "#14B8A6", name: "청록색" },
                      { color: "#6B7280", name: "회색" },
                    ].map(({ color, name }) => (
                      <div
                        key={color}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, color: color })
                          }
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: color,
                            border:
                              formData.color === color
                                ? "3px solid #1F2937"
                                : "2px solid #E5E7EB",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            transform:
                              formData.color === color
                                ? "scale(1.1)"
                                : "scale(1)",
                          }}
                          title={name}
                        />
                        <span style={{ fontSize: "11px", color: "#6B7280" }}>
                          {name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <label style={{ fontSize: "14px", color: "#4B5563" }}>
                      커스텀 색상:
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      style={{
                        width: "50px",
                        height: "30px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      placeholder="#000000"
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "4px",
                        width: "100px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>내용 *</label>
                  <RichEditor
                    value={htmlContent}
                    onChange={setHtmlContent}
                    placeholder="일정 내용을 입력하세요..."
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    backgroundColor: colors.gray[300],
                    color: colors.gray[700],
                    width: "auto",
                  }}
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    width: "auto",
                  }}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "저장 중..."
                    : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Customer Support Management Component
const CustomerSupportManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [detailModalData, setDetailModalData] = useState<{
    postId: string;
    title: string;
  } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-support", page, pageSize, searchQuery, selectedTag],
    queryFn: () => {
      return api.getCommunityPosts(
        page,
        pageSize,
        searchQuery || undefined,
        "suggestion",
        undefined,
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCommunityPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer-support"] });
      await queryClient.refetchQueries({
        queryKey: ["customer-support", page, searchQuery, selectedTag],
      });
      alert("문의글이 성공적으로 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "문의글 삭제에 실패했습니다.");
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>고객센터</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <span style={{ fontSize: "14px", color: colors.gray[600] }}>
              페이지당
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                backgroundColor: colors.white,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="10">10개</option>
              <option value="20">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setSearchQuery(searchInput);
              setPage(1);
            }
          }}
          placeholder="검색어 입력"
          style={{
            ...styles.input,
            width: "250px",
            padding: "10px 12px",
            fontSize: "14px",
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
          }}
        />
        <select
          value={selectedTag}
          onChange={(e) => {
            setSelectedTag(e.target.value);
            setPage(1);
          }}
          style={{
            ...styles.input,
            width: "180px",
            padding: "10px 12px",
            fontSize: "14px",
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <option value="">모든 태그</option>
          <option value="건의">건의</option>
          <option value="질문">질문</option>
        </select>
        <button
          onClick={() => {
            setSearchQuery(searchInput);
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: colors.primary,
            color: colors.white,
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          검색
        </button>
        <button
          onClick={() => {
            setSearchInput("");
            setSearchQuery("");
            setSelectedTag("");
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: colors.gray[200],
            color: colors.gray[700],
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          초기화
        </button>
      </div>

      <div style={styles.tableContainer}>
        {!data?.posts || data.posts.length === 0 ? (
          <EmptyState message="등록된 문의글이 없습니다." icon="💬" />
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>제목</th>
                    <th style={styles.th}>작성자</th>
                    <th style={styles.th}>태그</th>
                    <th style={styles.th}>작성일</th>
                    <th style={styles.th}>조회수</th>
                    <th style={styles.th}>댓글</th>
                    <th style={styles.th}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data.posts.map((post: any) => (
                    <tr
                      key={post.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === post.id ? styles.tableRowHover : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(post.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <div
                          style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.title}
                        </div>
                      </td>
                      <td style={styles.td}>{post.author_name}</td>
                      <td style={styles.td}>
                        {post.community_tags && post.community_tags.length > 0 ? (
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                            {post.community_tags.map((tag: string, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  backgroundColor:
                                    tag === "건의"
                                      ? "#E0E7FF"
                                      : tag === "질문"
                                      ? "#FEE2E2"
                                      : "#F3F4F6",
                                  color:
                                    tag === "건의"
                                      ? "#6366F1"
                                      : tag === "질문"
                                      ? "#EF4444"
                                      : "#6B7280",
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={styles.td}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {post.view_count.toLocaleString()}
                      </td>
                      <td style={styles.td}>{post.comment_count}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={{
                              ...styles.actionButton,
                              backgroundColor: colors.blue[600],
                            }}
                            onClick={() =>
                              setDetailModalData({
                                postId: post.id,
                                title: post.title,
                              })
                            }
                          >
                            내용 보기
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                            onClick={() => handleDelete(post.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {detailModalData && (
        <CustomerSupportDetailModal
          postId={detailModalData.postId}
          postTitle={detailModalData.title}
          onClose={() => setDetailModalData(null)}
        />
      )}
    </div>
  );
};

// Customer Support Detail Modal Component
const CustomerSupportDetailModal: React.FC<{
  postId: string;
  postTitle: string;
  onClose: () => void;
}> = ({ postId, postTitle, onClose }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();

  const { data: postDetail, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ["customer-support-detail", postId],
    queryFn: async () => {
      const result = await api.getCommunityDetail(postId);
      return result.post;
    },
  });

  const { data: commentsData, isLoading: commentsLoading, error: commentsError } = useQuery({
    queryKey: ["customer-support-comments", postId, page, pageSize],
    queryFn: async () => {
      console.log("Fetching comments for post:", postId);
      const result = await api.apiCall(`/api/comments/list/${postId}?sort=created_at_asc`);
      console.log("Comments result:", result);
      return result;
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return api.apiCall('/api/comments/create', {
        method: 'POST',
        body: JSON.stringify({
          target_id: postId,
          content: [{ type: 'text', content: content }],
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-support-comments"] });
      queryClient.invalidateQueries({ queryKey: ["customer-support"] });
      setReplyContent("");
      alert("답변이 등록되었습니다.");
    },
    onError: (error: any) => {
      alert(`답변 등록 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: api.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-support-comments"] });
      queryClient.invalidateQueries({ queryKey: ["customer-support"] });
      alert("댓글이 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(`삭제 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }
    createCommentMutation.mutate(replyContent);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    if (Array.isArray(content)) {
      return content.map((block: any, index: number) => {
        if (block.type === 'text') {
          return <p key={index} style={{ marginBottom: '8px' }}>{block.content}</p>;
        } else if (block.type === 'image') {
          return (
            <img
              key={index}
              src={block.url}
              alt={block.alt || ''}
              style={{ maxWidth: '100%', marginBottom: '8px', borderRadius: '4px' }}
            />
          );
        }
        return null;
      });
    }
    return null;
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div
        style={{ ...styles.modalContent, maxWidth: "900px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            ...styles.modalHeader,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{ ...styles.modalTitle, margin: 0 }}>문의 내용</h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: colors.gray[600],
              }}
            >
              {postTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              ...styles.modalCloseButton,
              position: "relative",
              top: "auto",
              right: "auto",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ ...styles.modalBody, flex: 1, overflow: "auto" }}>
          {postLoading ? (
            <div style={styles.loadingMessage}>내용을 불러오는 중...</div>
          ) : postError ? (
            <div style={styles.errorMessage}>내용을 불러오는 중 오류가 발생했습니다.</div>
          ) : (
            <>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: colors.gray[50],
                  borderRadius: "8px",
                  marginBottom: "24px",
                  border: `1px solid ${colors.gray[200]}`,
                }}
              >
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontWeight: "600", color: colors.gray[800] }}>
                    작성자: {postDetail?.author_name}
                  </span>
                  <span style={{ color: colors.gray[500], fontSize: "14px" }}>
                    {postDetail?.created_at && formatDate(postDetail.created_at)}
                  </span>
                  {postDetail?.community_tags && postDetail.community_tags.length > 0 && (
                    <div style={{ display: "flex", gap: "4px" }}>
                      {postDetail.community_tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: tag === "건의" ? "#E0E7FF" : "#FEE2E2",
                            color: tag === "건의" ? "#6366F1" : "#EF4444",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ color: colors.gray[700], fontSize: "15px", lineHeight: "1.6" }}>
                  {postDetail?.content && renderContent(postDetail.content)}
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: colors.gray[800] }}>
                  답변 ({commentsData?.total_count || 0})
                </h3>

                {commentsLoading ? (
                  <div style={styles.loadingMessage}>답변을 불러오는 중...</div>
                ) : commentsError ? (
                  <div style={styles.errorMessage}>답변을 불러오는 중 오류가 발생했습니다.</div>
                ) : (
                  <div style={{ marginBottom: "16px" }}>
                    {commentsData?.comments && Array.isArray(commentsData.comments) && commentsData.comments.length > 0 ? (
                      commentsData.comments.map((comment: any, index: number) => (
                        <div key={comment.id}>
                          <div
                            style={{
                              padding: "12px",
                              marginBottom: "8px",
                              backgroundColor: comment.is_deleted ? colors.gray[100] : colors.white,
                              borderRadius: "6px",
                              border: `1px solid ${comment.is_deleted ? colors.gray[300] : colors.gray[200]}`,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                  <span style={{ fontWeight: "600", fontSize: "14px", color: colors.gray[800] }}>
                                    {comment.author_name}
                                  </span>
                                  <span style={{ color: colors.gray[500], fontSize: "12px" }}>
                                    {formatDate(comment.created_at)}
                                  </span>
                                  {comment.is_deleted && (
                                    <span
                                      style={{
                                        padding: "2px 6px",
                                        backgroundColor: colors.gray[300],
                                        color: colors.gray[700],
                                        borderRadius: "3px",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      삭제됨
                                    </span>
                                  )}
                                </div>
                                <div style={{ color: colors.gray[700], fontSize: "14px", lineHeight: "1.5" }}>
                                  {comment.content && renderContent(comment.content)}
                                </div>
                              </div>
                              {!comment.is_deleted && (
                                <button
                                  onClick={() => {
                                    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
                                      deleteCommentMutation.mutate(comment.id);
                                    }
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    backgroundColor: colors.red[500],
                                    color: colors.white,
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginLeft: "12px",
                                  }}
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                          </div>

                          {comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0 && (
                            <div style={{ marginLeft: "32px", marginBottom: "8px" }}>
                              {comment.replies.map((reply: any) => (
                                <div
                                  key={reply.id}
                                  style={{
                                    padding: "12px",
                                    marginBottom: "8px",
                                    backgroundColor: reply.is_deleted ? colors.gray[100] : colors.blue[50],
                                    borderRadius: "6px",
                                    border: `1px solid ${reply.is_deleted ? colors.gray[300] : colors.blue[200]}`,
                                    borderLeft: `3px solid ${colors.blue[500]}`,
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "12px", color: colors.gray[500] }}>↳</span>
                                        <span style={{ fontWeight: "600", fontSize: "13px", color: colors.gray[800] }}>
                                          {reply.author_name}
                                        </span>
                                        <span style={{ color: colors.gray[500], fontSize: "11px" }}>
                                          {formatDate(reply.created_at)}
                                        </span>
                                        {reply.is_deleted && (
                                          <span
                                            style={{
                                              padding: "2px 6px",
                                              backgroundColor: colors.gray[300],
                                              color: colors.gray[700],
                                              borderRadius: "3px",
                                              fontSize: "10px",
                                              fontWeight: "500",
                                            }}
                                          >
                                            삭제됨
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ color: colors.gray[700], fontSize: "13px", lineHeight: "1.5" }}>
                                        {reply.content && renderContent(reply.content)}
                                      </div>
                                    </div>
                                    {!reply.is_deleted && (
                                      <button
                                        onClick={() => {
                                          if (window.confirm("이 대댓글을 삭제하시겠습니까?")) {
                                            deleteCommentMutation.mutate(reply.id);
                                          }
                                        }}
                                        style={{
                                          padding: "4px 10px",
                                          fontSize: "11px",
                                          backgroundColor: colors.red[500],
                                          color: colors.white,
                                          border: "none",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                          marginLeft: "12px",
                                        }}
                                      >
                                        삭제
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "20px", textAlign: "center", color: colors.gray[500] }}>
                        아직 답변이 없습니다.
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleReplySubmit}>
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ ...styles.label, display: "block", marginBottom: "8px" }}>
                      답변 작성
                    </label>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답변을 입력하세요..."
                      style={{
                        ...styles.input,
                        minHeight: "100px",
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      disabled={createCommentMutation.isPending || !replyContent.trim()}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: createCommentMutation.isPending || !replyContent.trim() ? colors.gray[300] : colors.primary,
                        color: colors.white,
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: createCommentMutation.isPending || !replyContent.trim() ? "not-allowed" : "pointer",
                      }}
                    >
                      {createCommentMutation.isPending ? "등록 중..." : "답변 등록"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Community Management Component
const CommunityManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [commentsModalData, setCommentsModalData] = useState<{
    postId: string;
    title: string;
  } | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    category: "free_board",
    linked_news_id: "",
  });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(""); // 검색 입력값
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색 쿼리
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "notice">("posts"); // 탭 상태 추가

  const queryClient = useQueryClient();

  // 자동 저장 기능 - 폼 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (isModalOpen && !editingPost) {
      const draftData = {
        formData,
        htmlContent,
        timestamp: Date.now(),
      };
      localStorage.setItem("communityFormDraft", JSON.stringify(draftData));
    }
  }, [formData, htmlContent, isModalOpen, editingPost]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["community", page, pageSize, searchQuery, selectedCategory, activeTab],
    queryFn: () => {
      // 공지사항 탭일 때는 notice 카테고리로 필터링
      const category = activeTab === "notice" ? "notice" : selectedCategory || undefined;
      return api.getCommunityPosts(
        page,
        pageSize,
        searchQuery || undefined,
        category,
        undefined, // authorId
      );
    },
  });

  const createMutation = useMutation({
    mutationFn: api.createCommunityPost,
    onSuccess: async () => {
      // 모든 community 관련 쿼리 무효화 및 새로고침
      await queryClient.invalidateQueries({ queryKey: ["community"] });
      await queryClient.refetchQueries({
        queryKey: ["community", page, searchQuery, selectedCategory, activeTab],
      });
      alert(activeTab === "notice" ? "공지사항이 성공적으로 등록되었습니다." : "게시글이 성공적으로 등록되었습니다.");
      localStorage.removeItem("communityFormDraft"); // 성공 시 임시 저장 삭제
      closeModal();
      setFormData({
        title: "",
        category: activeTab === "notice" ? "notice" : "free_board",
        linked_news_id: "",
      });
      setHtmlContent("");
    },
    onError: (error: any) => {
      alert(error.message || "게시글 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: api.CommunityUpdateData }) =>
      api.updateCommunityPost(id, data),
    onSuccess: async () => {
      // 모든 community 관련 쿼리 무효화 및 새로고침
      await queryClient.invalidateQueries({ queryKey: ["community"] });
      await queryClient.refetchQueries({
        queryKey: ["community", page, searchQuery, selectedCategory, activeTab],
      });
      alert(activeTab === "notice" ? "공지사항이 성공적으로 수정되었습니다." : "게시글이 성공적으로 수정되었습니다.");
      localStorage.removeItem("communityFormDraft"); // 성공 시 임시 저장 삭제
      closeModal();
      setFormData({
        title: "",
        category: activeTab === "notice" ? "notice" : "free_board",
        linked_news_id: "",
      });
      setHtmlContent("");
    },
    onError: (error: any) => {
      alert(error.message || "게시글 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteCommunityPost,
    onSuccess: async () => {
      // 모든 community 관련 쿼리 무효화 및 새로고침
      await queryClient.invalidateQueries({ queryKey: ["community"] });
      await queryClient.refetchQueries({
        queryKey: ["community", page, searchQuery, selectedCategory, activeTab],
      });
      alert(activeTab === "notice" ? "공지사항이 성공적으로 삭제되었습니다." : "게시글이 성공적으로 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "게시글 삭제에 실패했습니다.");
    },
  });

  const openModal = async (post?: any) => {
    if (post) {
      setEditingPost(post);
      // 상세 정보 가져오기
      try {
        const detailData = await api.getCommunityDetail(post.id);
        const postDetail = detailData.post;

        setFormData({
          title: postDetail.title || "",
          category: postDetail.category || "free_board",
          linked_news_id: postDetail.linked_news?.id || "",
        });

        // 커뮤니티는 태그 사용 안함

        // 콘텐츠를 HTML로 변환
        if (Array.isArray(postDetail.content)) {
          const html = convertContentBlocksToHtml(postDetail.content);
          setHtmlContent(html);
        } else if (typeof postDetail.content === "string") {
          setHtmlContent(`<p>${postDetail.content}</p>`);
        } else {
          setHtmlContent("");
        }
      } catch (error) {
        console.error("Failed to fetch post detail:", error);
        // 기본값 사용
        setFormData({
          title: post.title || "",
          category: post.category || "free_board",
          linked_news_id: "",
        });
        setHtmlContent(post.content ? `<p>${post.content}</p>` : "");
      }
    } else {
      setEditingPost(null);

      // 임시 저장된 데이터 확인 및 복원
      const draftData = localStorage.getItem("communityFormDraft");
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          // 24시간 이내의 데이터인지 확인
          if (
            draft.timestamp &&
            Date.now() - draft.timestamp < 24 * 60 * 60 * 1000
          ) {
            const confirmRestore = window.confirm(
              "이전에 작성 중이던 내용이 있습니다. 복원하시겠습니까?",
            );
            if (confirmRestore) {
              setFormData(
                draft.formData || {
                  title: "",
                  category: activeTab === "notice" ? "notice" : "free_board",
                  linked_news_id: "",
                },
              );
              setHtmlContent(draft.htmlContent || "");
              setIsModalOpen(true);
              return;
            } else {
              localStorage.removeItem("communityFormDraft");
            }
          } else {
            // 24시간이 지난 데이터는 삭제
            localStorage.removeItem("communityFormDraft");
          }
        } catch (e) {
          console.error("Failed to restore draft:", e);
          localStorage.removeItem("communityFormDraft");
        }
      }

      setFormData({
        title: "",
        category: activeTab === "notice" ? "notice" : "free_board",
        linked_news_id: "",
      });
      setHtmlContent("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({
      title: "",
      category: activeTab === "notice" ? "notice" : "free_board",
      linked_news_id: "",
    });
    setHtmlContent("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert("제목은 필수입니다.");
      return;
    }

    // Validate HTML content
    if (
      !htmlContent ||
      htmlContent === "<p><br></p>" ||
      htmlContent.trim() === ""
    ) {
      alert("내용을 입력해주세요.");
      return;
    }

    // Convert HTML to content blocks
    const contentBlocks = convertHtmlToContentBlocks(htmlContent);

    if (editingPost) {
      const updateData: api.CommunityUpdateData = {
        title: formData.title,
        content: contentBlocks,
        tags: [], // 커뮤니티는 태그 사용 안함
      };
      updateMutation.mutate({ id: editingPost.id, data: updateData });
    } else {
      const postData: api.CommunityPostData = {
        title: formData.title,
        content: contentBlocks,
        category: activeTab === "notice" ? "notice" : formData.category,
        linked_news_id: formData.linked_news_id || undefined,
        tags: [], // 커뮤니티는 태그 사용 안함
      };
      createMutation.mutate(postData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>커뮤니티 관리</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "auto",
            }}
          >
            <span style={{ fontSize: "14px", color: colors.gray[600] }}>
              페이지당
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: "8px",
                backgroundColor: colors.white,
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="10">10개</option>
              <option value="20">20개</option>
              <option value="50">50개</option>
              <option value="100">100개</option>
            </select>
          </div>
          <button style={styles.addButton} onClick={() => openModal()}>
            <span>+</span> {activeTab === "notice" ? "공지사항 작성" : "게시글 작성"}
          </button>
        </div>
      </div>

      {/* 탭 UI */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          borderBottom: `2px solid ${colors.gray[200]}`,
        }}
      >
        <button
          onClick={() => {
            setActiveTab("posts");
            setPage(1);
            setSelectedCategory("");
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom:
              activeTab === "posts"
                ? `3px solid ${colors.primary}`
                : "3px solid transparent",
            color: activeTab === "posts" ? colors.primary : colors.gray[600],
            fontSize: "16px",
            fontWeight: activeTab === "posts" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "-2px",
          }}
        >
          커뮤니티 게시글
        </button>
        <button
          onClick={() => {
            setActiveTab("notice");
            setPage(1);
            setSelectedCategory("");
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom:
              activeTab === "notice"
                ? `3px solid ${colors.primary}`
                : "3px solid transparent",
            color: activeTab === "notice" ? colors.primary : colors.gray[600],
            fontSize: "16px",
            fontWeight: activeTab === "notice" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "-2px",
          }}
        >
          공지사항
        </button>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setSearchQuery(searchInput);
              setPage(1);
            }
          }}
          placeholder="검색어 입력"
          style={{
            ...styles.input,
            width: "250px",
            padding: "10px 12px",
            fontSize: "14px",
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
          }}
        />
        {activeTab === "posts" && (
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            style={{
              ...styles.input,
              width: "180px",
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <option value="">모든 게시판</option>
            <option value="free_board">자유게시판</option>
            <option value="news_discussion">뉴스토론</option>
          </select>
        )}
        <button
          onClick={() => {
            setSearchQuery(searchInput);
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: colors.primary,
            color: colors.white,
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          검색
        </button>
        <button
          onClick={() => {
            setSearchInput("");
            setSearchQuery("");
            setSelectedCategory("");
            setPage(1);
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: colors.gray[200],
            color: colors.gray[700],
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          초기화
        </button>
      </div>

      <div style={styles.tableContainer}>
        {!data?.posts || data.posts.length === 0 ? (
          <EmptyState message={activeTab === "notice" ? "등록된 공지사항이 없습니다." : "등록된 게시글이 없습니다."} icon={activeTab === "notice" ? "📢" : ""} />
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>제목</th>
                    <th style={styles.th}>작성자</th>
                    <th style={styles.th}>카테고리</th>
                    <th style={styles.th}>작성일</th>
                    <th style={styles.th}>조회수</th>
                    <th style={styles.th}>댓글</th>
                    <th style={styles.th}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data.posts.map((post: any) => (
                    <tr
                      key={post.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === post.id ? styles.tableRowHover : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(post.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <div
                          style={{
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {post.title}
                        </div>
                      </td>
                      <td style={styles.td}>{post.author_name}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor:
                              post.category === "free_board"
                                ? "#E0E7FF"
                                : post.category === "news_discussion"
                                ? "#FEE2E2"
                                : "#F3F4F6",
                            color:
                              post.category === "free_board"
                                ? "#6366F1"
                                : post.category === "news_discussion"
                                ? "#EF4444"
                                : "#6B7280",
                          }}
                        >
                          {post.category === "free_board"
                            ? "자유게시판"
                            : post.category === "news_discussion"
                            ? "뉴스토론"
                            : post.category || "기타"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {post.view_count.toLocaleString()}
                      </td>
                      <td style={styles.td}>{post.comment_count}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={{
                              ...styles.actionButton,
                              backgroundColor: colors.purple[500],
                            }}
                            onClick={() =>
                              setCommentsModalData({
                                postId: post.id,
                                title: post.title,
                              })
                            }
                          >
                            댓글
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton,
                            }}
                            onClick={() => openModal(post)}
                          >
                            수정
                          </button>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.deleteButton,
                            }}
                            onClick={() => handleDelete(post.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={{ ...styles.modalContent, maxWidth: "800px" }}>
            <div style={{ ...styles.modalHeader, position: "relative" }}>
              <h2 style={styles.modalTitle}>
                {editingPost ? "게시글 수정" : "게시글 작성"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const hasContent =
                    formData.title ||
                    formData.linked_news_id ||
                    htmlContent ||
                    (formData.category && formData.category !== "free_board");
                  if (hasContent && !editingPost) {
                    const result = window.confirm(
                      "작성 중인 내용을 임시 저장하시겠습니까?\n\n확인: 임시 저장 후 닫기\n취소: 저장하지 않고 닫기",
                    );
                    if (result) {
                      // 임시 저장 후 닫기
                      const draftData = {
                        formData,
                        htmlContent,
                        timestamp: Date.now(),
                      };
                      localStorage.setItem(
                        "communityFormDraft",
                        JSON.stringify(draftData),
                      );
                      alert(
                        "임시 저장되었습니다. 다음에 게시글 작성을 누르면 복원됩니다.",
                      );
                      closeModal();
                    } else {
                      // 저장하지 않고 닫기
                      if (
                        window.confirm(
                          "임시 저장하지 않고 닫으시겠습니까? 작성 중인 내용이 모두 사라집니다.",
                        )
                      ) {
                        localStorage.removeItem("communityFormDraft");
                        closeModal();
                      }
                    }
                  } else {
                    closeModal();
                    localStorage.removeItem("communityFormDraft");
                  }
                }}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  fontSize: "28px",
                  fontWeight: "300",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "0",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";
                }}
                title="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>제목 *</label>
                  <input
                    style={styles.input}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="게시글 제목을 입력하세요"
                    required
                  />
                </div>

                {activeTab === "posts" && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>카테고리 *</label>
                    <select
                      style={styles.input}
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      disabled={!!editingPost}
                      required
                    >
                      <option value="free_board">자유게시판</option>
                      <option value="news_discussion">뉴스토론</option>
                    </select>
                    {editingPost && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: colors.gray[500],
                          marginTop: "4px",
                        }}
                      >
                        카테고리는 수정할 수 없습니다.
                      </p>
                    )}
                  </div>
                )}

                {!editingPost && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>연결된 뉴스 ID (선택)</label>
                    <input
                      style={styles.input}
                      value={formData.linked_news_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          linked_news_id: e.target.value,
                        })
                      }
                      placeholder="연결할 뉴스의 ID를 입력하세요"
                    />
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.label}>내용 *</label>
                  <RichEditor
                    value={htmlContent}
                    onChange={setHtmlContent}
                    placeholder="게시글 내용을 입력하세요..."
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    backgroundColor: colors.gray[300],
                    color: colors.gray[700],
                    width: "auto",
                  }}
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    backgroundColor: colors.primary,
                    color: colors.white,
                    width: "auto",
                  }}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "처리 중..."
                    : editingPost
                    ? "수정"
                    : "작성"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {commentsModalData && (
        <CommunityCommentsModal
          postId={commentsModalData.postId}
          postTitle={commentsModalData.title}
          onClose={() => setCommentsModalData(null)}
        />
      )}
    </div>
  );
};

// Community Comments Modal Component
const CommunityCommentsModal: React.FC<{
  postId: string;
  postTitle: string;
  onClose: () => void;
}> = ({ postId, postTitle, onClose }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["community-comments", postId, page, pageSize],
    queryFn: async () => {
      console.log("Fetching comments for community post:", postId);
      const result = await api.getCommentsList(
        page,
        pageSize,
        undefined,
        undefined,
        postId,
        "community",
        undefined,
        "created_at_desc",
        false,
      );
      console.log("Community comments result:", result);

      // 만약 백엔드가 필터링을 제대로 하지 않는다면 프론트에서 필터링
      if (result.comments && Array.isArray(result.comments)) {
        const filteredComments = result.comments.filter(
          (c: any) => c.target_id === postId,
        );
        return {
          ...result,
          comments: filteredComments,
          total_count: filteredComments.length,
        };
      }

      return result;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-comments"] });
      alert("댓글이 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(`삭제 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div
        style={{ ...styles.modalContent, maxWidth: "900px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            ...styles.modalHeader,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ ...styles.modalTitle, margin: 0 }}>커뮤니티 댓글</h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: colors.gray[600],
              }}
            >
              {postTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              ...styles.modalCloseButton,
              position: "relative",
              top: "auto",
              right: "auto",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>
        <div style={styles.modalBody}>
          {isLoading ? (
            <div style={styles.loadingMessage}>댓글을 불러오는 중...</div>
          ) : error ? (
            <div style={styles.errorMessage}>
              댓글을 불러오는 중 오류가 발생했습니다.
            </div>
          ) : (
            <>
              <div
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  backgroundColor: colors.gray[50],
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                {data?.comments &&
                Array.isArray(data.comments) &&
                data.comments.length > 0 ? (
                  data.comments.map((comment: any, index: number) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: "12px",
                        marginBottom:
                          index < data.comments.length - 1 ? "8px" : "0",
                        backgroundColor: comment.is_deleted
                          ? colors.gray[100]
                          : colors.white,
                        borderRadius: "6px",
                        border: `1px solid ${
                          comment.is_deleted
                            ? colors.gray[300]
                            : colors.gray[200]
                        }`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: colors.gray[800],
                              }}
                            >
                              {comment.author_name}
                            </span>
                            <span
                              style={{
                                color: colors.gray[500],
                                fontSize: "12px",
                              }}
                            >
                              {formatDate(comment.created_at)}
                            </span>
                            {comment.is_deleted && (
                              <span
                                style={{
                                  padding: "2px 6px",
                                  backgroundColor: colors.gray[300],
                                  color: colors.gray[700],
                                  borderRadius: "3px",
                                  fontSize: "11px",
                                  fontWeight: "500",
                                }}
                              >
                                삭제됨
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              color: colors.gray[700],
                              fontSize: "14px",
                              lineHeight: "1.5",
                            }}
                          >
                            {(() => {
                              let content = comment.content;

                              // content가 문자열이고 JSON처럼 보이면 파싱 시도
                              if (
                                typeof content === "string" &&
                                content.startsWith("[") &&
                                content.endsWith("]")
                              ) {
                                try {
                                  const parsed = JSON.parse(content);
                                  if (Array.isArray(parsed)) {
                                    // 파싱된 배열에서 텍스트 추출
                                    return parsed
                                      .map((item: any) => {
                                        if (typeof item === "string")
                                          return item;
                                        if (
                                          item.type === "text" &&
                                          item.content
                                        )
                                          return item.content;
                                        if (item.type === "image")
                                          return "[이미지]";
                                        return "";
                                      })
                                      .filter(Boolean)
                                      .join(" ");
                                  }
                                } catch {
                                  // 파싱 실패시 원본 반환
                                  return content;
                                }
                              }

                              // content가 이미 배열인 경우
                              if (Array.isArray(content)) {
                                return content
                                  .map((item: any) => {
                                    if (typeof item === "string") return item;
                                    if (item.type === "text" && item.content)
                                      return item.content;
                                    if (item.type === "image")
                                      return "[이미지]";
                                    return "";
                                  })
                                  .filter(Boolean)
                                  .join(" ");
                              }

                              // 일반 문자열인 경우
                              if (typeof content === "string") {
                                return content;
                              }

                              // 기타 경우
                              return JSON.stringify(content);
                            })()}
                          </div>
                        </div>
                        {!comment.is_deleted && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm("이 댓글을 삭제하시겠습니까?")
                              ) {
                                deleteMutation.mutate(comment.id);
                              }
                            }}
                            style={{
                              padding: "6px 12px",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: colors.gray[700],
                              backgroundColor: colors.white,
                              border: `1px solid ${colors.gray[300]}`,
                              borderRadius: "4px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.red[50];
                              e.currentTarget.style.borderColor =
                                colors.red[300];
                              e.currentTarget.style.color = colors.red[600];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors.white;
                              e.currentTarget.style.borderColor =
                                colors.gray[300];
                              e.currentTarget.style.color = colors.gray[700];
                            }}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: colors.gray[500],
                    }}
                  >
                    댓글이 없습니다.
                  </div>
                )}
              </div>
              {data && Number(data.total_count) > 0 && (
                <div style={{ ...styles.pagination, marginTop: "16px" }}>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    style={{
                      ...styles.paginationButton,
                      ...(page === 1 ? styles.paginationButtonDisabled : {}),
                    }}
                  >
                    이전
                  </button>
                  <span style={styles.paginationInfo}>
                    {page} / {Math.ceil(Number(data.total_count) / pageSize)}{" "}
                    페이지 (총 {data.total_count}개)
                  </span>
                  <button
                    onClick={() =>
                      setPage(
                        Math.min(
                          Math.ceil(Number(data.total_count) / pageSize),
                          page + 1,
                        ),
                      )
                    }
                    disabled={
                      page >= Math.ceil(Number(data.total_count) / pageSize)
                    }
                    style={{
                      ...styles.paginationButton,
                      ...(page >= Math.ceil(Number(data.total_count) / pageSize)
                        ? styles.paginationButtonDisabled
                        : {}),
                    }}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Tag Management Component
const TagManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tags" | "tickers">("tags");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_required: false,
    is_ticker: false,
  });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // 자동 저장 기능 - 폼 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (isModalOpen && !editingTag) {
      const draftData = {
        formData,
        activeTab,
        timestamp: Date.now(),
      };
      localStorage.setItem("tagFormDraft", JSON.stringify(draftData));
    }
  }, [formData, activeTab, isModalOpen, editingTag]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tags-management"],
    queryFn: () => api.getTags(),
  });

  const createMutation = useMutation({
    mutationFn: api.createTag,
    onSuccess: async () => {
      // 모든 tags 관련 쿼리 무효화 및 새로고침
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      await queryClient.invalidateQueries({ queryKey: ["tags-management"] });
      await refetch();
      alert("태그가 성공적으로 등록되었습니다.");
      localStorage.removeItem("tagFormDraft"); // 성공 시 임시 저장 삭제
      closeModal();
      setFormData({
        name: "",
        description: "",
        is_required: false,
        is_ticker: false,
      });
    },
    onError: (error: any) => {
      alert(error.message || "태그 생성에 실패했습니다.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateTag(id, data),
    onSuccess: async () => {
      // 모든 tags 관련 쿼리 무효화 및 새로고침
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      await queryClient.invalidateQueries({ queryKey: ["tags-management"] });
      await refetch();
      alert("태그가 성공적으로 수정되었습니다.");
      localStorage.removeItem("tagFormDraft"); // 성공 시 임시 저장 삭제
      closeModal();
      setFormData({
        name: "",
        description: "",
        is_required: false,
        is_ticker: false,
      });
    },
    onError: (error: any) => {
      alert(error.message || "태그 수정에 실패했습니다.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteTag,
    onSuccess: async () => {
      // 모든 tags 관련 쿼리 무효화 및 새로고침
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      await queryClient.invalidateQueries({ queryKey: ["tags-management"] });
      await refetch();
      alert("태그가 성공적으로 삭제되었습니다.");
    },
    onError: (error: any) => {
      alert(error.message || "태그 삭제에 실패했습니다.");
    },
  });

  const openModal = (tag?: any) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({
        name: tag.name || "",
        description: tag.description || "",
        is_required: tag.is_required || false,
        is_ticker: tag.is_ticker || false,
      });
    } else {
      setEditingTag(null);

      // 임시 저장된 데이터 확인 및 복원
      const draftData = localStorage.getItem("tagFormDraft");
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          // 24시간 이내의 데이터인지 확인
          if (
            draft.timestamp &&
            Date.now() - draft.timestamp < 24 * 60 * 60 * 1000
          ) {
            const confirmRestore = window.confirm(
              "이전에 작성 중이던 내용이 있습니다. 복원하시겠습니까?",
            );
            if (confirmRestore) {
              setFormData(
                draft.formData || {
                  name: "",
                  description: "",
                  is_required: false,
                  is_ticker: false,
                },
              );
              if (draft.activeTab) {
                setActiveTab(draft.activeTab);
              }
              setIsModalOpen(true);
              return;
            } else {
              localStorage.removeItem("tagFormDraft");
            }
          } else {
            // 24시간이 지난 데이터는 삭제
            localStorage.removeItem("tagFormDraft");
          }
        } catch (e) {
          console.error("Failed to restore draft:", e);
          localStorage.removeItem("tagFormDraft");
        }
      }

      setFormData({
        name: "",
        description: "",
        is_required: false,
        is_ticker: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormData({
      name: "",
      description: "",
      is_required: false,
      is_ticker: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert(`${activeTab === "tags" ? "태그" : "티커"} 이름은 필수입니다.`);
      return;
    }

    // 일반 태그 탭에서 $ 기호 입력 방지
    if (activeTab === "tags" && formData.name.includes("$")) {
      alert(
        "일반 태그에는 $ 기호를 사용할 수 없습니다. 기업 티커는 티커 탭에서 추가해주세요.",
      );
      return;
    }

    // 티커 탭에서는 is_ticker를 true로 설정하고 $ 추가
    const submitData = {
      ...formData,
      is_ticker: activeTab === "tickers",
    };

    // 티커인 경우 $ 기호 추가
    if (activeTab === "tickers" && !submitData.name.startsWith("$")) {
      submitData.name = "$" + submitData.name.toUpperCase();
    }

    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>태그 관리</h1>
        <button style={styles.addButton} onClick={() => openModal()}>
          <span>+</span> {activeTab === "tags" ? "태그" : "티커"} 추가
        </button>
      </div>

      {/* 탭 UI */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          borderBottom: `2px solid ${colors.gray[200]}`,
        }}
      >
        <button
          onClick={() => setActiveTab("tags")}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom:
              activeTab === "tags"
                ? `3px solid ${colors.primary}`
                : "3px solid transparent",
            color: activeTab === "tags" ? colors.primary : colors.gray[600],
            fontSize: "16px",
            fontWeight: activeTab === "tags" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "-2px",
          }}
        >
          일반 태그
        </button>
        <button
          onClick={() => setActiveTab("tickers")}
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom:
              activeTab === "tickers"
                ? `3px solid ${colors.primary}`
                : "3px solid transparent",
            color: activeTab === "tickers" ? colors.primary : colors.gray[600],
            fontSize: "16px",
            fontWeight: activeTab === "tickers" ? "600" : "500",
            cursor: "pointer",
            transition: "all 0.2s",
            marginBottom: "-2px",
          }}
        >
          기업 티커
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            backgroundColor: "#F0F9FF",
            border: "1px solid #BAE6FD",
            borderRadius: "12px",
            padding: "16px",
            fontSize: "14px",
            color: "#0C4A6E",
          }}
        >
          {activeTab === "tags" ? (
            <>
              <strong>태그 사용 가이드</strong>
              <ul style={{ margin: "8px 0 0 16px", paddingLeft: "8px" }}>
                <li>
                  필수 태그는 중요도가 높은 태그를 표시하는 용도로 사용됩니다.
                </li>
                <li>태그 이름은 간결하고 명확하게 작성해주세요.</li>
                <li>
                  설명을 추가하면 작성자가 태그를 선택할 때 도움이 됩니다.
                </li>
              </ul>
            </>
          ) : (
            <>
              <strong>💹 기업 티커 사용 가이드</strong>
              <ul style={{ margin: "8px 0 0 16px", paddingLeft: "8px" }}>
                <li>
                  기업 티커는 주식 종목 코드를 의미합니다 (예: NVDA, AAPL, TSLA)
                </li>
                <li>티커 심볼만 입력하세요. 대문자로 자동 변환됩니다.</li>
                <li>뉴스/리포트 작성 시 관련 기업을 태그할 수 있습니다.</li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div style={styles.tableContainer}>
        {(() => {
          // 티커와 일반 태그 필터링
          const filteredTags =
            data?.tags?.filter((tag: any) => {
              if (activeTab === "tickers") {
                return tag.is_ticker === true;
              } else {
                return tag.is_ticker === false;
              }
            }) || [];

          if (filteredTags.length === 0) {
            return (
              <EmptyState
                message={
                  activeTab === "tags"
                    ? "등록된 태그가 없습니다."
                    : "등록된 티커가 없습니다."
                }
                icon={activeTab === "tags" ? "🏷️" : "💹"}
              />
            );
          }

          return (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>
                      {activeTab === "tags" ? "태그" : "티커"} 이름
                    </th>
                    <th style={styles.th}>설명</th>
                    <th style={styles.th}>유형</th>
                    <th style={styles.th}>생성일</th>
                    <th style={styles.th}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.map((tag: any) => (
                    <tr
                      key={tag.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === tag.id ? styles.tableRowHover : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(tag.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#111827",
                          }}
                        >
                          {tag.name}
                        </span>
                      </td>
                      <td style={styles.td}>{tag.description || "-"}</td>
                      <td style={styles.td}>
                        {tag.is_required ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              backgroundColor: "#FEF3C7",
                              color: "#92400E",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            필수
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              backgroundColor: "#E0E7FF",
                              color: "#3730A3",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            선택
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {new Date(tag.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={{
                              ...styles.actionButton,
                              ...styles.editButton,
                            }}
                            onClick={() => openModal(tag)}
                          >
                            수정
                          </button>
                          {!tag.is_required && (
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.deleteButton,
                              }}
                              onClick={() => handleDelete(tag.id)}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ ...styles.modalHeader, position: "relative" }}>
              <h2 style={styles.modalTitle}>
                {editingTag
                  ? activeTab === "tags"
                    ? "태그 수정"
                    : "티커 수정"
                  : activeTab === "tags"
                  ? "태그 추가"
                  : "티커 추가"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const hasContent =
                    formData.name ||
                    formData.description ||
                    formData.is_required;
                  if (hasContent && !editingTag) {
                    const result = window.confirm(
                      "작성 중인 내용을 임시 저장하시겠습니까?\n\n확인: 임시 저장 후 닫기\n취소: 저장하지 않고 닫기",
                    );
                    if (result) {
                      // 임시 저장 후 닫기
                      const draftData = {
                        formData,
                        activeTab,
                        timestamp: Date.now(),
                      };
                      localStorage.setItem(
                        "tagFormDraft",
                        JSON.stringify(draftData),
                      );
                      alert(
                        "임시 저장되었습니다. 다음에 태그/티커 추가를 누르면 복원됩니다.",
                      );
                      closeModal();
                    } else {
                      // 저장하지 않고 닫기
                      if (
                        window.confirm(
                          "임시 저장하지 않고 닫으시겠습니까? 작성 중인 내용이 모두 사라집니다.",
                        )
                      ) {
                        localStorage.removeItem("tagFormDraft");
                        closeModal();
                      }
                    }
                  } else {
                    closeModal();
                    localStorage.removeItem("tagFormDraft");
                  }
                }}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#ffffff",
                  border: "1px solid #E5E7EB",
                  fontSize: "28px",
                  fontWeight: "300",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "0",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#374151";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0, 0, 0, 0.05)";
                }}
                title="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    {activeTab === "tags" ? "태그" : "티커"} 이름 *
                  </label>
                  <input
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (activeTab === "tickers") {
                        // 티커 탭에서는 $ 제거 후 대문자로 변환
                        value = value.replace(/^\$/, "").toUpperCase();
                      }
                      setFormData({ ...formData, name: value });
                    }}
                    placeholder={
                      activeTab === "tags"
                        ? "예: 주식, 채권, 부동산"
                        : "예: NVDA, AAPL, TSLA"
                    }
                    required
                  />
                  {activeTab === "tickers" && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        marginTop: "4px",
                      }}
                    >
                      티커 심볼만 입력하세요 (예: NVDA, AAPL). 대문자로 자동
                      변환됩니다.
                    </p>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>설명</label>
                  <textarea
                    style={{ ...styles.textarea, minHeight: "80px" }}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="이 태그에 대한 설명을 입력하세요"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.is_required}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_required: e.target.checked,
                        })
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                    />
                    <span style={styles.label}>필수 태그로 설정</span>
                  </label>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6B7280",
                      marginTop: "4px",
                    }}
                  >
                    필수 태그로 설정하면 태그 목록에서 강조 표시됩니다.
                  </p>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={{
                    ...styles.button,
                    backgroundColor: "#E5E7EB",
                    color: "#374151",
                    width: "auto",
                  }}
                  onClick={closeModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.button,
                    backgroundColor: "#6366F1",
                    width: "auto",
                  }}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "저장 중..."
                    : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Statistics Management Component
const StatisticsManagement: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["statistics"],
    queryFn: api.getSystemStatistics,
    refetchInterval: 60000 * 5, // 5분마다 자동 새로고침
    refetchOnWindowFocus: false, // 창 포커스 시 자동 갱신 비활성화
    staleTime: 60000 * 2, // 2분간 데이터를 신선한 것으로 간주
  });

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>
        통계 데이터를 불러오는데 실패했습니다.
      </div>
    );
  if (!data) return null;

  const { user_statistics, post_statistics } = data;

  const StatCard: React.FC<{
    title: string;
    value: number | string;
    subtitle?: string;
    color?: string;
  }> = ({ title, value, subtitle, color = colors.gray[800] }) => (
    <div
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: "relative" as const,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          backgroundColor: color,
        }}
      />
      <div
        style={{
          fontSize: "13px",
          color: colors.gray[500],
          marginBottom: "12px",
          fontWeight: "500",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: colors.gray[900],
          marginBottom: "8px",
          lineHeight: "1",
        }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: "12px",
            color: colors.gray[400],
            lineHeight: "1.4",
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: "0", maxWidth: "100%" }}>
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: colors.gray[900],
                marginBottom: "8px",
              }}
            >
              통계
            </h1>
            <div style={{ fontSize: "13px", color: colors.gray[500] }}>
              마지막 업데이트:{" "}
              {new Date(data.timestamp).toLocaleString("ko-KR")}
            </div>
          </div>
          <button
            onClick={() => refetch()}
            style={{
              padding: "8px 16px",
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              color: colors.gray[700],
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.gray[50];
              e.currentTarget.style.borderColor = colors.gray[400];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.white;
              e.currentTarget.style.borderColor = colors.gray[300];
            }}
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 사용자 통계 */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: `2px solid ${colors.gray[200]}`,
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: colors.gray[800],
            }}
          >
            사용자 현황
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
          className="stat-grid"
        >
          <StatCard
            title="현재 접속"
            value={user_statistics.online_users}
            subtitle="실시간 사용자"
            color={colors.green[600]}
          />
          <StatCard
            title="오늘 활동"
            value={user_statistics.today_active}
            subtitle="24시간 내"
            color={colors.blue[600]}
          />
          <StatCard
            title="주간 활동"
            value={user_statistics.week_active}
            subtitle="7일간"
            color={colors.purple[600]}
          />
          <StatCard
            title="월간 활동"
            value={user_statistics.month_active}
            subtitle="30일간"
            color={colors.orange[600]}
          />
          <StatCard
            title="전체 회원"
            value={user_statistics.total_users}
            subtitle="누적 가입자"
            color={colors.gray[700]}
          />
          <StatCard
            title="오늘 신규"
            value={user_statistics.new_users_today}
            subtitle="24시간 내 가입"
            color={colors.primary}
          />
          <StatCard
            title="주간 신규"
            value={user_statistics.new_users_week}
            subtitle="7일간 가입"
            color={colors.secondary}
          />
        </div>
      </div>

      {/* 게시물 통계 */}
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            marginBottom: "20px",
            paddingBottom: "12px",
            borderBottom: `2px solid ${colors.gray[200]}`,
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: colors.gray[800],
            }}
          >
            콘텐츠 현황
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
          }}
          className="stat-grid"
        >
          <StatCard
            title="오늘 뉴스"
            value={post_statistics.news_today}
            subtitle="24시간 내"
            color={colors.blue[600]}
          />
          <StatCard
            title="오늘 커뮤니티"
            value={post_statistics.community_today}
            subtitle="24시간 내"
            color={colors.purple[600]}
          />
          <StatCard
            title="오늘 전체"
            value={post_statistics.total_posts_today}
            subtitle="뉴스+커뮤니티"
            color={colors.green[600]}
          />
          <StatCard
            title="주간 뉴스"
            value={post_statistics.news_week}
            subtitle="7일간"
            color={colors.orange[600]}
          />
          <StatCard
            title="주간 커뮤니티"
            value={post_statistics.community_week}
            subtitle="7일간"
            color={colors.indigo[600]}
          />
          <StatCard
            title="주간 전체"
            value={post_statistics.total_posts_week}
            subtitle="뉴스+커뮤니티"
            color={colors.secondary}
          />
          <StatCard
            title="오늘 댓글"
            value={post_statistics.comments_today}
            subtitle="24시간 내"
            color={colors.primary}
          />
          <StatCard
            title="전체 뉴스"
            value={post_statistics.total_news}
            subtitle="누적"
            color={colors.gray[700]}
          />
          <StatCard
            title="전체 커뮤니티"
            value={post_statistics.total_community}
            subtitle="누적"
            color={colors.gray[600]}
          />
          <StatCard
            title="전체 댓글"
            value={post_statistics.total_comments}
            subtitle="누적"
            color={colors.gray[500]}
          />
        </div>
      </div>
    </div>
  );
};

// Mobile Navigation Component
type TabType =
  | "statistics"
  | "news"
  | "report"
  | "user"
  | "calendar"
  | "community"
  | "customer-support"
  | "tags"
  | "terms"
  | "reports"
  | "comments"
  | "deleted";

const MobileNav: React.FC<{
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "news" as TabType, label: "뉴스 관리", icon: "" },
    { id: "report" as TabType, label: "리포트 관리", icon: "" },
    { id: "user" as TabType, label: "회원 관리", icon: "" },
    { id: "calendar" as TabType, label: "캘린더", icon: "" },
    { id: "community" as TabType, label: "커뮤니티", icon: "" },
    { id: "customer-support" as TabType, label: "고객센터", icon: "💬" },
    { id: "comments" as TabType, label: "댓글 관리", icon: "" },
    { id: "tags" as TabType, label: "태그 관리", icon: "" },
    { id: "terms" as TabType, label: "약관 설정", icon: "" },
    { id: "reports" as TabType, label: "신고 관리", icon: "" },
    { id: "deleted" as TabType, label: "삭제 목록", icon: "🗑️" },
    { id: "statistics" as TabType, label: "통계", icon: "" },
  ];

  const hamburgerStyle = {
    display: "block",
    padding: "8px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
  };

  const mobileMenuStyle = {
    position: "fixed" as const,
    top: "60px",
    left: isOpen ? "0" : "-100%",
    width: "80%",
    maxWidth: "300px",
    height: "calc(100vh - 60px)",
    backgroundColor: colors.white,
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
    transition: "left 0.3s ease-out",
    zIndex: 999,
    overflowY: "auto" as const,
    padding: "20px",
  };

  const mobileOverlayStyle = {
    position: "fixed" as const,
    top: "60px",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: isOpen ? "block" : "none",
    zIndex: 998,
  };

  const mobileNavItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    marginBottom: "8px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left" as const,
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "16px",
    fontWeight: "500",
    color: colors.gray[700],
  };

  return (
    <>
      <button
        style={hamburgerStyle}
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-only"
      >
        ☰
      </button>

      <div style={mobileOverlayStyle} onClick={() => setIsOpen(false)} />

      <div style={mobileMenuStyle}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: colors.primary,
            }}
          >
            SAVENEWS
          </div>
          <div
            style={{
              fontSize: "14px",
              color: colors.gray[500],
              marginTop: "4px",
            }}
          >
            Admin Dashboard
          </div>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            style={{
              ...mobileNavItemStyle,
              ...(activeTab === item.id
                ? {
                    backgroundColor: colors.primary,
                    color: colors.white,
                  }
                : {}),
            }}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false);
            }}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

// User Reports Management Component
const UserReportsManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<api.UserReport | null>(
    null,
  );
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showReporterDetailModal, setShowReporterDetailModal] = useState(false);
  const [showCommentDetailModal, setShowCommentDetailModal] = useState(false);
  const [selectedReporter, setSelectedReporter] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [processFormData, setProcessFormData] = useState<api.UserReportUpdate>({
    status: "PENDING",
    admin_note: "",
    should_ban: false,
  });
  const [banReason, setBanReason] = useState("");

  const queryClient = useQueryClient();

  // 신고 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ["userReports", page, pageSize, statusFilter, typeFilter],
    queryFn: () =>
      api.getUserReports(
        page,
        pageSize,
        statusFilter || undefined,
        typeFilter || undefined,
      ),
  });

  // 신고 처리
  const processMutation = useMutation({
    mutationFn: async ({
      reportId,
      data,
    }: {
      reportId: string;
      data: api.UserReportUpdate;
    }) => {
      // 먼저 신고 처리
      const result = await api.processUserReport(reportId, data);

      // 차단 처리가 필요한 경우
      if (data.should_ban && selectedReport?.target_author_id) {
        await api.updateUserStatus(selectedReport.target_author_id, {
          is_banned: true,
          ban_reason:
            banReason ||
            `신고 처리: ${selectedReport.reason} - ${selectedReport.description}`,
        });
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReports"] });
      alert("신고가 성공적으로 처리되었습니다.");
      closeProcessModal();
    },
    onError: (error: any) => {
      alert(error.message || "신고 처리에 실패했습니다.");
    },
  });

  const openProcessModal = (report: api.UserReport) => {
    setSelectedReport(report);
    setProcessFormData({
      status: report.status === "PENDING" ? "PENDING" : report.status,
      admin_note: report.admin_note || "",
      should_ban: false,
    });
    setShowProcessModal(true);
  };

  const closeProcessModal = () => {
    setShowProcessModal(false);
    setSelectedReport(null);
    setProcessFormData({
      status: "PENDING",
      admin_note: "",
      should_ban: false,
    });
    setBanReason("");
  };

  const handleProcessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReport) {
      processMutation.mutate({
        reportId: selectedReport.id,
        data: processFormData,
      });
    }
  };

  // 신고 유형 한글 변환
  const getTargetTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      NEWS_COMMENT: "뉴스 댓글",
      COMMUNITY_POST: "커뮤니티 게시글",
      COMMUNITY_COMMENT: "커뮤니티 댓글",
      USER: "사용자",
    };
    return labels[type] || type;
  };

  // 신고 사유 한글 변환
  const getReasonLabel = (reason: string) => {
    const labels: { [key: string]: string } = {
      SPAM: "스팸",
      ABUSE: "욕설/비방",
      INAPPROPRIATE: "부적절한 내용",
      COPYRIGHT: "저작권 침해",
      OTHER: "기타",
    };
    return labels[reason] || reason;
  };

  // 상태 한글 변환
  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      PENDING: "대기중",
      REVIEWED: "검토됨",
      RESOLVED: "처리완료",
      REJECTED: "반려",
    };
    return labels[status] || status;
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bg: colors.warning + "20", color: colors.warning };
      case "REVIEWED":
        return { bg: colors.info + "20", color: colors.info };
      case "RESOLVED":
        return { bg: colors.success + "20", color: colors.success };
      case "REJECTED":
        return { bg: colors.error + "20", color: colors.error };
      default:
        return { bg: colors.gray[200], color: colors.gray[600] };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil((data?.total_count || 0) / pageSize);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>신고 관리</h1>
      </div>

      {/* 필터 영역 */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "10px 12px",
            fontSize: "14px",
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
            backgroundColor: colors.white,
            cursor: "pointer",
            outline: "none",
            minWidth: "140px",
          }}
        >
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="RESOLVED">처리완료</option>
          <option value="REJECTED">반려</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "10px 12px",
            fontSize: "14px",
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "8px",
            backgroundColor: colors.white,
            cursor: "pointer",
            outline: "none",
            minWidth: "160px",
          }}
        >
          <option value="">전체 유형</option>
          <option value="NEWS_COMMENT">뉴스 댓글</option>
          <option value="COMMUNITY_POST">커뮤니티 게시글</option>
          <option value="COMMUNITY_COMMENT">커뮤니티 댓글</option>
          <option value="USER">사용자</option>
        </select>

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px", color: colors.gray[600] }}>
            페이지당
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "8px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="10">10개</option>
            <option value="20">20개</option>
            <option value="50">50개</option>
            <option value="100">100개</option>
          </select>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {!data?.reports || data.reports.length === 0 ? (
          <EmptyState message="신고 내역이 없습니다." icon="🚨" />
        ) : (
          <>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>신고일시</th>
                    <th style={styles.th}>대상 유형</th>
                    <th style={styles.th}>신고 사유</th>
                    <th style={styles.th}>설명</th>
                    <th style={styles.th}>신고자</th>
                    <th style={styles.th}>상태</th>
                    <th style={styles.th}>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data.reports.map((report: api.UserReport) => (
                    <tr
                      key={report.id}
                      style={{
                        ...styles.tableRow,
                        ...(hoveredRow === report.id
                          ? styles.tableRowHover
                          : {}),
                      }}
                      onMouseEnter={() => setHoveredRow(report.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        {new Date(report.created_at).toLocaleString("ko-KR")}
                      </td>
                      <td style={styles.td}>
                        <div>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              backgroundColor: colors.gray[100],
                              color: colors.gray[700],
                            }}
                          >
                            {getTargetTypeLabel(report.target_type)}
                          </span>
                          {report.target_title && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: colors.gray[500],
                                marginTop: "4px",
                              }}
                            >
                              {report.target_title.substring(0, 30)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            backgroundColor: colors.orange[600] + "20",
                            color: colors.orange[600],
                            fontWeight: "500",
                          }}
                        >
                          {getReasonLabel(report.reason)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div
                          style={{
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "13px",
                          }}
                        >
                          {report.description}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div
                          onClick={() => {
                            if (report.reporter_id) {
                              setSelectedReporter({
                                id: report.reporter_id,
                                name: report.reporter_name || "Unknown",
                              });
                              setShowReporterDetailModal(true);
                            }
                          }}
                          style={{
                            cursor: report.reporter_id ? "pointer" : "default",
                            color: report.reporter_id
                              ? colors.blue[600]
                              : "inherit",
                            textDecoration: report.reporter_id
                              ? "underline"
                              : "none",
                          }}
                        >
                          {report.reporter_name || "Unknown"}
                        </div>
                        {report.reporter_id && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: colors.gray[500],
                              marginTop: "2px",
                            }}
                          >
                            ID: {report.reporter_id}
                          </div>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: getStatusColor(report.status).bg,
                            color: getStatusColor(report.status).color,
                          }}
                        >
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.actionButton}
                          onClick={() => openProcessModal(report)}
                        >
                          처리
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* 신고 처리 모달 */}
      {showProcessModal && selectedReport && (
        <div style={styles.modal} onClick={closeProcessModal}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "600px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>신고 처리</h2>
              <button
                onClick={closeProcessModal}
                style={{
                  ...styles.modalCloseButton,
                  position: "relative",
                  top: "auto",
                  right: "auto",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProcessSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>신고 정보</label>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: colors.gray[50],
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{ fontWeight: "600", color: colors.gray[600] }}
                      >
                        신고 대상:
                      </div>
                      <div>
                        {getTargetTypeLabel(selectedReport.target_type)} (ID:{" "}
                        {selectedReport.target_id})
                      </div>

                      <div
                        style={{ fontWeight: "600", color: colors.gray[600] }}
                      >
                        신고 사유:
                      </div>
                      <div>
                        <span
                          style={{
                            padding: "2px 8px",
                            backgroundColor: colors.red[100],
                            color: colors.red[700],
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {getReasonLabel(selectedReport.reason)}
                        </span>
                      </div>

                      <div
                        style={{ fontWeight: "600", color: colors.gray[600] }}
                      >
                        상세 설명:
                      </div>
                      <div>{selectedReport.description}</div>

                      <div
                        style={{ fontWeight: "600", color: colors.gray[600] }}
                      >
                        신고자:
                      </div>
                      <div>
                        {selectedReport.reporter_name || "Unknown"} (
                        {selectedReport.reporter_id})
                      </div>

                      <div
                        style={{ fontWeight: "600", color: colors.gray[600] }}
                      >
                        신고 일시:
                      </div>
                      <div>{formatDate(selectedReport.created_at)}</div>
                    </div>
                  </div>
                </div>

                {/* 신고 대상 콘텐츠 표시 */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>신고된 콘텐츠</label>
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    {selectedReport.target_author && (
                      <div style={{ marginBottom: "12px" }}>
                        <strong style={{ color: colors.gray[700] }}>
                          작성자:
                        </strong>{" "}
                        {selectedReport.target_author}
                      </div>
                    )}
                    {selectedReport.target_title && (
                      <div style={{ marginBottom: "12px" }}>
                        <strong style={{ color: colors.gray[700] }}>
                          제목:
                        </strong>{" "}
                        {selectedReport.target_title}
                      </div>
                    )}
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: colors.gray[50],
                        borderRadius: "6px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      <strong style={{ color: colors.gray[700] }}>내용:</strong>
                      <div style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>
                        {(() => {
                          if (!selectedReport.target_content) {
                            return "콘텐츠를 불러올 수 없습니다.";
                          }
                          if (
                            typeof selectedReport.target_content === "string"
                          ) {
                            return selectedReport.target_content;
                          }
                          if (Array.isArray(selectedReport.target_content)) {
                            // content가 배열인 경우 (뉴스/리포트 content 형식)
                            return selectedReport.target_content
                              .map((item: any) => {
                                if (typeof item === "string") return item;
                                if (item.type === "text") return item.content;
                                if (item.type === "image")
                                  return `[이미지: ${item.alt || item.url}]`;
                                return JSON.stringify(item);
                              })
                              .join("\n");
                          }
                          return JSON.stringify(selectedReport.target_content);
                        })()}
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        gap: "12px",
                        paddingTop: "12px",
                        borderTop: `1px solid ${colors.gray[200]}`,
                      }}
                    >
                      <button
                        type="button"
                        onClick={async () => {
                          // 원본 게시글/댓글로 이동 (새 탭)
                          console.log("Selected Report:", selectedReport);

                          if (selectedReport.target_type === "NEWS_COMMENT") {
                            // 뉴스 댓글인 경우, admin API로 댓글 정보 조회
                            try {
                              const response = await api.getCommentsList(1, 100, undefined, undefined, undefined, 'news');
                              console.log("All comments:", response);

                              // 모든 댓글에서 해당 댓글 찾기
                              const comments = Array.isArray(response.comments) ? response.comments : [];
                              const comment = comments.find((c: any) => c.id === selectedReport.target_id);

                              if (comment && comment.target_id) {
                                window.open(
                                  `https://www.saveticker.com/news/${comment.target_id}#comment-${selectedReport.target_id}`,
                                  "_blank",
                                );
                              } else {
                                alert("댓글 정보를 찾을 수 없습니다. 삭제된 댓글일 수 있습니다.");
                              }
                            } catch (error) {
                              console.error("Error fetching comment:", error);
                              alert("댓글 정보를 불러오는데 실패했습니다.");
                            }
                          } else if (selectedReport.target_type === "COMMUNITY_COMMENT") {
                            // 커뮤니티 댓글인 경우
                            try {
                              const response = await api.getCommentsList(1, 100, undefined, undefined, undefined, 'community');
                              console.log("All comments:", response);

                              // 모든 댓글에서 해당 댓글 찾기
                              const comments = Array.isArray(response.comments) ? response.comments : [];
                              const comment = comments.find((c: any) => c.id === selectedReport.target_id);

                              if (comment && comment.target_id) {
                                window.open(
                                  `https://www.saveticker.com/community/${comment.target_id}#comment-${selectedReport.target_id}`,
                                  "_blank",
                                );
                              } else {
                                alert("댓글 정보를 찾을 수 없습니다. 삭제된 댓글일 수 있습니다.");
                              }
                            } catch (error) {
                              console.error("Error fetching comment:", error);
                              alert("댓글 정보를 불러오는데 실패했습니다.");
                            }
                          } else if (selectedReport.target_type === "COMMUNITY_POST") {
                            window.open(
                              `https://www.saveticker.com/community/${selectedReport.target_id}`,
                              "_blank",
                            );
                          }
                        }}
                        style={{
                          padding: "8px 16px",
                          fontSize: "14px",
                          color: colors.blue[600],
                          backgroundColor: colors.blue[50],
                          border: `1px solid ${colors.blue[200]}`,
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        원본 보기
                      </button>
                    </div>
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>처리 상태 *</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    {["PENDING", "RESOLVED", "REJECTED"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setProcessFormData({
                            ...processFormData,
                            status: status as any,
                          })
                        }
                        style={{
                          flex: 1,
                          padding: "10px",
                          border: `1px solid ${
                            processFormData.status === status
                              ? colors.blue[500]
                              : colors.gray[300]
                          }`,
                          backgroundColor:
                            processFormData.status === status
                              ? colors.blue[50]
                              : colors.white,
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight:
                              processFormData.status === status ? "600" : "400",
                          }}
                        >
                          {getStatusLabel(status)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>관리자 메모</label>
                  <textarea
                    value={processFormData.admin_note}
                    onChange={(e) =>
                      setProcessFormData({
                        ...processFormData,
                        admin_note: e.target.value,
                      })
                    }
                    placeholder="처리 내용이나 메모를 입력하세요 (예: 경고 조치, 콘텐츠 삭제 등)"
                    style={{
                      ...styles.textarea,
                      minHeight: "100px",
                    }}
                  />
                </div>

                {processFormData.status === "RESOLVED" &&
                  selectedReport?.target_author_id && (
                    <div
                      style={{
                        padding: "16px",
                        backgroundColor: colors.gray[50],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: "8px",
                        marginTop: "16px",
                      }}
                    >
                      <div style={styles.formGroup}>
                        <label
                          style={{
                            ...styles.label,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            margin: 0,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={processFormData.should_ban || false}
                            onChange={(e) => {
                              setProcessFormData({
                                ...processFormData,
                                should_ban: e.target.checked,
                              });
                              if (!e.target.checked) setBanReason("");
                            }}
                            style={{ width: "18px", height: "18px" }}
                          />
                          <span style={{ fontWeight: "500" }}>
                            사용자 차단 처리
                          </span>
                        </label>
                        <div
                          style={{
                            fontSize: "13px",
                            color: colors.gray[600],
                            marginTop: "8px",
                            marginLeft: "26px",
                          }}
                        >
                          <div>
                            대상 사용자:{" "}
                            <strong>
                              {selectedReport.target_author || "Unknown"}
                            </strong>{" "}
                            ({selectedReport.target_author_id})
                          </div>
                          <div
                            style={{
                              marginTop: "4px",
                              fontSize: "12px",
                              color: colors.red[600],
                              fontWeight: "600",
                            }}
                          >
                            주의: 한번 차단 처리하면 되돌릴 수 없습니다.
                          </div>
                          <div
                            style={{
                              marginTop: "2px",
                              fontSize: "12px",
                              color: colors.gray[500],
                            }}
                          >
                            선택 시 해당 사용자의 계정이 즉시 차단됩니다.
                          </div>
                        </div>

                        {processFormData.should_ban && (
                          <div
                            style={{ marginTop: "12px", marginLeft: "26px" }}
                          >
                            <label
                              style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: colors.gray[700],
                              }}
                            >
                              차단 사유:
                            </label>
                            <textarea
                              value={banReason}
                              onChange={(e) => setBanReason(e.target.value)}
                              placeholder="차단 사유를 입력하세요 (선택사항)"
                              style={{
                                width: "100%",
                                padding: "8px",
                                marginTop: "6px",
                                border: `1px solid ${colors.gray[300]}`,
                                borderRadius: "6px",
                                fontSize: "13px",
                                minHeight: "60px",
                                resize: "vertical",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={closeProcessModal}
                  style={styles.cancelButton}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={processMutation.isPending}
                >
                  {processMutation.isPending ? "처리 중..." : "처리하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 신고자 상세 모달 */}
      {showReporterDetailModal && selectedReporter && (
        <div
          style={styles.modal}
          onClick={() => setShowReporterDetailModal(false)}
        >
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "700px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>신고자 정보</h2>
              <button
                onClick={() => setShowReporterDetailModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                  color: colors.gray[600],
                  lineHeight: "1",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                ...styles.modalBody,
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <ReporterDetailContent
                reporterId={selectedReporter.id}
                reporterName={selectedReporter.name}
              />
            </div>
            <div
              style={{
                ...styles.modalFooter,
                flexShrink: 0,
                borderTop: `1px solid ${colors.gray[200]}`,
                padding: "16px 20px",
              }}
            >
              <button
                onClick={() => setShowReporterDetailModal(false)}
                style={styles.cancelButton}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reporter Detail Component - 신고자의 현재 정보를 표시
const ReporterDetailContent: React.FC<{
  reporterId: string;
  reporterName: string;
}> = ({ reporterId, reporterName }) => {
  // 사용자 현재 정보 조회
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userDetail", reporterId],
    queryFn: async () => {
      try {
        return await api.getUserDetail(reporterId);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        사용자 정보를 불러오는 중...
      </div>
    );
  }

  const user = userData?.user_info || userData?.user || userData;
  const currentName = user?.name || user?.username || reporterName;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          gap: "12px",
          padding: "16px",
          backgroundColor: colors.gray[50],
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontWeight: "600", color: colors.gray[600] }}>
          사용자 ID
        </div>
        <div>{reporterId}</div>

        <div style={{ fontWeight: "600", color: colors.gray[600] }}>
          현재 닉네임
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{currentName}</span>
          {currentName !== reporterName && (
            <span
              style={{
                fontSize: "12px",
                color: colors.orange[600],
                backgroundColor: colors.orange[600] + "20",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              변경됨 (신고 당시: {reporterName})
            </span>
          )}
        </div>

        {user?.email && (
          <>
            <div style={{ fontWeight: "600", color: colors.gray[600] }}>
              이메일
            </div>
            <div>{user.email}</div>
          </>
        )}

        {user?.created_at && (
          <>
            <div style={{ fontWeight: "600", color: colors.gray[600] }}>
              가입일
            </div>
            <div>{new Date(user.created_at).toLocaleDateString("ko-KR")}</div>
          </>
        )}

        <div style={{ fontWeight: "600", color: colors.gray[600] }}>상태</div>
        <div>
          {user?.is_banned ? (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: colors.red[100],
                color: colors.red[600],
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              차단됨
            </span>
          ) : user?.is_deleted ? (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: colors.gray[200],
                color: colors.gray[600],
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              탈퇴
            </span>
          ) : (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: colors.green[100],
                color: colors.green[600],
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              활성
            </span>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: colors.warning + "10",
            borderRadius: "8px",
            border: `1px solid ${colors.warning + "30"}`,
          }}
        >
          <p style={{ margin: 0, color: colors.gray[700], fontSize: "14px" }}>
            ⚠️ 사용자의 현재 정보를 불러올 수 없습니다. 신고 당시 닉네임:{" "}
            <strong>{reporterName}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

// Terms Management Component
const TermsManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerms, setEditingTerms] = useState<api.TermsData | null>(null);
  const [formData, setFormData] = useState({
    terms_id: "",
    content: "",
  });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // 약관 목록 조회
  const {
    data: termsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["terms"],
    queryFn: api.getAllTerms,
  });

  // 약관 수정
  const updateMutation = useMutation({
    mutationFn: ({ termsId, content }: { termsId: string; content: string }) =>
      api.updateTerms(termsId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["terms"] });
      alert("약관이 성공적으로 수정되었습니다.");
      closeModal();
    },
    onError: (error: any) => {
      alert(error.message || "약관 수정에 실패했습니다.");
    },
  });

  const openModal = (terms: api.TermsData) => {
    setEditingTerms(terms);
    setFormData({
      terms_id: terms.terms_id,
      content: terms.content,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTerms(null);
    setFormData({
      terms_id: "",
      content: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTerms) {
      updateMutation.mutate({
        termsId: editingTerms.terms_id,
        content: formData.content,
      });
    }
  };

  // 약관 ID에 따른 한글 이름 반환
  const getTermsLabel = (termsId: string) => {
    const labels: { [key: string]: string } = {
      service: "서비스 이용약관",
      privacy: "개인정보 처리방침",
      marketing: "마케팅 정보 수신 동의",
    };
    return labels[termsId] || termsId;
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div style={styles.errorContainer}>데이터를 불러오는데 실패했습니다.</div>
    );

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>약관 설정</h1>
      </div>

      <div style={styles.tableContainer}>
        {!termsData || termsData.length === 0 ? (
          <EmptyState message="등록된 약관이 없습니다." icon="📄" />
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>약관 ID</th>
                  <th style={styles.th}>약관명</th>
                  <th style={styles.th}>내용 미리보기</th>
                  <th style={styles.th}>생성일</th>
                  <th style={styles.th}>수정일</th>
                  <th style={styles.th}>액션</th>
                </tr>
              </thead>
              <tbody>
                {termsData.map((terms: api.TermsData) => (
                  <tr
                    key={terms.terms_id}
                    style={{
                      ...styles.tableRow,
                      ...(hoveredRow === terms.terms_id
                        ? styles.tableRowHover
                        : {}),
                    }}
                    onMouseEnter={() => setHoveredRow(terms.terms_id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          backgroundColor: colors.gray[100],
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "13px",
                        }}
                      >
                        {terms.terms_id}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: "500" }}>
                        {getTermsLabel(terms.terms_id)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div
                        style={{
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: colors.gray[600],
                          fontSize: "13px",
                        }}
                      >
                        {terms.content
                          .replace(/<[^>]*>/g, "")
                          .substring(0, 100)}
                        ...
                      </div>
                    </td>
                    <td style={styles.td}>
                      {terms.created_at
                        ? new Date(terms.created_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      {terms.updated_at
                        ? new Date(terms.updated_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.actionButton}
                        onClick={() => openModal(terms)}
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 약관 수정 모달 */}
      {isModalOpen && editingTerms && (
        <div style={styles.modal} onClick={closeModal}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>
                약관 수정 - {getTermsLabel(editingTerms.terms_id)}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  ...styles.modalCloseButton,
                  position: "relative",
                  top: "auto",
                  right: "auto",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>약관 내용 *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="약관 내용을 입력하세요."
                    style={{
                      ...styles.textarea,
                      minHeight: "500px",
                      fontFamily: "monospace",
                      fontSize: "13px",
                    }}
                    required
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={styles.cancelButton}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "처리 중..." : "수정하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Comments Management Component
const CommentsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [authorSearchInput, setAuthorSearchInput] = useState("");
  const [authorSearchQuery, setAuthorSearchQuery] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState<
    "all" | "news" | "community"
  >("all");
  const [deletedFilter, setDeletedFilter] = useState<
    "all" | "deleted" | "active"
  >("all");
  const [sortBy, setSortBy] = useState<"created_at_desc" | "created_at_asc">(
    "created_at_desc",
  );
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "comments",
      page,
      pageSize,
      searchQuery,
      authorSearchQuery,
      targetTypeFilter,
      deletedFilter,
      sortBy,
    ],
    queryFn: async () => {
      const response = await api.getCommentsList(
        page,
        pageSize,
        searchQuery || undefined,
        authorSearchQuery || undefined, // authorId parameter (searches by author name in API)
        undefined, // targetId
        targetTypeFilter !== "all" ? targetTypeFilter : undefined,
        deletedFilter === "deleted"
          ? true
          : deletedFilter === "active"
          ? false
          : undefined,
        sortBy,
        deletedFilter === "all" || deletedFilter === "deleted", // includeDeleted: true when showing all or deleted
      );

      // API 응답 정규화
      if (typeof response.comments === "string") {
        try {
          return {
            ...response,
            comments: JSON.parse(response.comments as string),
            total_count:
              typeof response.total_count === "string"
                ? parseInt(response.total_count)
                : response.total_count,
          };
        } catch {
          return {
            ...response,
            comments: [],
            total_count: 0,
          };
        }
      }

      return {
        ...response,
        total_count:
          typeof response.total_count === "string"
            ? parseInt(response.total_count)
            : response.total_count,
      };
    },
    enabled: true,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      alert("댓글이 삭제되었습니다.");
      setSelectedComment(null);
    },
    onError: (error: any) => {
      alert(`삭제 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
    },
  });

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setAuthorSearchQuery(authorSearchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (error) {
    return (
      <div style={styles.errorMessage}>
        댓글 목록을 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>댓글 관리</h1>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: colors.white,
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            flex: "1 1 auto",
            minWidth: "300px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="댓글 내용 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: "1 1 200px",
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              outline: "none",
            }}
          />
          <input
            type="text"
            placeholder="작성자 검색..."
            value={authorSearchInput}
            onChange={(e) => setAuthorSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: "1 1 150px",
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: "500",
              color: colors.white,
              backgroundColor: colors.primary,
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              whiteSpace: "nowrap" as const,
            }}
          >
            검색
          </button>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select
            value={targetTypeFilter}
            onChange={(e) => {
              setTargetTypeFilter(
                e.target.value as "all" | "news" | "community",
              );
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">모든 타입</option>
            <option value="news">뉴스</option>
            <option value="community">커뮤니티</option>
          </select>
          <select
            value={deletedFilter}
            onChange={(e) => {
              setDeletedFilter(e.target.value as "all" | "deleted" | "active");
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="deleted">삭제됨</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "created_at_desc" | "created_at_asc");
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="created_at_desc">최신순</option>
            <option value="created_at_asc">오래된순</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{
              padding: "10px 12px",
              fontSize: "14px",
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "6px",
              backgroundColor: colors.white,
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="10">10개씩</option>
            <option value="20">20개씩</option>
            <option value="50">50개씩</option>
            <option value="100">100개씩</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.loadingMessage}>댓글을 불러오는 중...</div>
      ) : (
        <>
          <div style={styles.card}>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{ ...styles.tableHeader, width: "100px" }}>
                      타입
                    </th>
                    <th style={{ ...styles.tableHeader, width: "200px" }}>
                      대상
                    </th>
                    <th style={{ ...styles.tableHeader, width: "150px" }}>
                      작성자
                    </th>
                    <th style={{ ...styles.tableHeader, minWidth: "300px" }}>
                      내용
                    </th>
                    <th style={{ ...styles.tableHeader, width: "150px" }}>
                      작성일
                    </th>
                    <th style={{ ...styles.tableHeader, width: "80px" }}>
                      상태
                    </th>
                    <th style={{ ...styles.tableHeader, width: "120px" }}>
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    Array.isArray(data.comments) &&
                    data.comments.map((comment: any) => (
                      <tr
                        key={comment.id}
                        style={
                          comment.is_deleted
                            ? { ...styles.tableRow, opacity: 0.6 }
                            : styles.tableRow
                        }
                      >
                        <td style={styles.tableCell}>
                          <span
                            style={{
                              ...styles.badge,
                              backgroundColor:
                                comment.target_type === "news"
                                  ? colors.blue[100]
                                  : colors.green[100],
                              color:
                                comment.target_type === "news"
                                  ? colors.blue[600]
                                  : colors.green[600],
                            }}
                          >
                            {comment.target_type === "news"
                              ? "뉴스"
                              : "커뮤니티"}
                          </span>
                        </td>
                        <td style={styles.tableCell}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: colors.gray[600],
                            }}
                          >
                            {truncateText(
                              comment.target_title || comment.target_id,
                              30,
                            )}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div
                            onClick={() => setSelectedAuthor(comment)}
                            style={{ cursor: "pointer" }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                color: colors.blue[600],
                                textDecoration: "underline",
                              }}
                            >
                              {comment.author_name}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: colors.gray[500],
                              }}
                            >
                              {comment.author_id}
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ maxWidth: "300px" }}>
                            {(() => {
                              let content = comment.content;

                              // content가 문자열이고 JSON처럼 보이면 파싱 시도
                              if (
                                typeof content === "string" &&
                                content.startsWith("[") &&
                                content.endsWith("]")
                              ) {
                                try {
                                  const parsed = JSON.parse(content);
                                  if (Array.isArray(parsed)) {
                                    // 파싱된 배열에서 텍스트 추출
                                    const text = parsed
                                      .map((item: any) => {
                                        if (typeof item === "string")
                                          return item;
                                        if (
                                          item.type === "text" &&
                                          item.content
                                        )
                                          return item.content;
                                        if (item.type === "image")
                                          return "[이미지]";
                                        return "";
                                      })
                                      .filter(Boolean)
                                      .join(" ");
                                    return truncateText(text, 100);
                                  }
                                } catch {
                                  // 파싱 실패시 원본 사용
                                  return truncateText(content, 100);
                                }
                              }

                              // 일반 문자열인 경우
                              if (typeof content === "string") {
                                return truncateText(content, 100);
                              }

                              // 배열인 경우
                              if (Array.isArray(content)) {
                                const text = content
                                  .map((item: any) => {
                                    if (typeof item === "string") return item;
                                    if (item.type === "text" && item.content)
                                      return item.content;
                                    if (item.type === "image")
                                      return "[이미지]";
                                    return "";
                                  })
                                  .filter(Boolean)
                                  .join(" ");
                                return truncateText(text, 100);
                              }

                              return "";
                            })()}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          {formatDate(comment.created_at)}
                        </td>
                        <td style={styles.tableCell}>
                          {comment.is_deleted ? (
                            <span
                              style={{
                                ...styles.badge,
                                backgroundColor: colors.red[100],
                                color: colors.red[600],
                              }}
                            >
                              삭제됨
                            </span>
                          ) : (
                            <span
                              style={{
                                ...styles.badge,
                                backgroundColor: colors.green[100],
                                color: colors.green[600],
                              }}
                            >
                              활성
                            </span>
                          )}
                        </td>
                        <td style={styles.tableCell}>
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() => setSelectedComment(comment)}
                              style={{
                                padding: "4px 10px",
                                fontSize: "11px",
                                fontWeight: "500",
                                color: colors.white,
                                backgroundColor: colors.blue[500],
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                whiteSpace: "nowrap" as const,
                              }}
                            >
                              상세
                            </button>
                            {!comment.is_deleted && (
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "이 댓글을 삭제하시겠습니까?",
                                    )
                                  ) {
                                    deleteMutation.mutate(comment.id);
                                  }
                                }}
                                style={{
                                  padding: "4px 10px",
                                  fontSize: "11px",
                                  fontWeight: "500",
                                  color: colors.white,
                                  backgroundColor: colors.red[500],
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap" as const,
                                }}
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {(!data?.comments ||
                !Array.isArray(data.comments) ||
                data.comments.length === 0) && (
                <div style={styles.noData}>댓글이 없습니다.</div>
              )}
            </div>
          </div>

          {data && Number(data.total_count) > 0 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  ...styles.paginationButton,
                  ...(page === 1 ? styles.paginationButtonDisabled : {}),
                }}
              >
                이전
              </button>
              <span style={styles.paginationInfo}>
                {page} / {Math.ceil(Number(data.total_count) / pageSize)} 페이지
                (총 {data.total_count}개)
              </span>
              <button
                onClick={() =>
                  setPage(
                    Math.min(
                      Math.ceil(Number(data.total_count) / pageSize),
                      page + 1,
                    ),
                  )
                }
                disabled={
                  page >= Math.ceil(Number(data.total_count) / pageSize)
                }
                style={{
                  ...styles.paginationButton,
                  ...(page >= Math.ceil(Number(data.total_count) / pageSize)
                    ? styles.paginationButtonDisabled
                    : {}),
                }}
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {selectedComment && (
        <div style={styles.modal} onClick={() => setSelectedComment(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>댓글 상세</h2>
              <button
                onClick={() => setSelectedComment(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                  color: colors.gray[600],
                  lineHeight: "1",
                }}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr",
                  gap: "12px",
                  padding: "16px",
                  backgroundColor: colors.gray[50],
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              >
                <div style={{ fontWeight: "600", color: colors.gray[600] }}>
                  타입
                </div>
                <div>
                  <span
                    style={{
                      padding: "2px 8px",
                      backgroundColor:
                        selectedComment.target_type === "news"
                          ? colors.blue[100]
                          : colors.green[100],
                      color:
                        selectedComment.target_type === "news"
                          ? colors.blue[600]
                          : colors.green[600],
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    {selectedComment.target_type === "news"
                      ? "뉴스"
                      : "커뮤니티"}
                  </span>
                </div>

                <div style={{ fontWeight: "600", color: colors.gray[600] }}>
                  대상 게시글
                </div>
                <div>
                  {selectedComment.target_title || selectedComment.target_id}
                </div>

                <div style={{ fontWeight: "600", color: colors.gray[600] }}>
                  작성자
                </div>
                <div>
                  {selectedComment.author_name} ({selectedComment.author_id})
                </div>

                <div style={{ fontWeight: "600", color: colors.gray[600] }}>
                  작성일
                </div>
                <div>{formatDate(selectedComment.created_at)}</div>

                {selectedComment.updated_at &&
                  selectedComment.updated_at !== selectedComment.created_at && (
                    <>
                      <div
                        style={{ fontWeight: "600", color: colors.gray[600] }}
                      >
                        수정일
                      </div>
                      <div>{formatDate(selectedComment.updated_at)}</div>
                    </>
                  )}

                {selectedComment.is_deleted && (
                  <>
                    <div style={{ fontWeight: "600", color: colors.gray[600] }}>
                      삭제일
                    </div>
                    <div style={{ color: colors.red[600] }}>
                      {formatDate(selectedComment.deleted_at)}
                    </div>
                  </>
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>댓글 내용</label>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: "8px",
                    minHeight: "100px",
                  }}
                >
                  {(() => {
                    let content = selectedComment.content;

                    // content가 문자열이고 JSON처럼 보이면 파싱 시도
                    if (
                      typeof content === "string" &&
                      content.startsWith("[") &&
                      content.endsWith("]")
                    ) {
                      try {
                        const parsed = JSON.parse(content);
                        if (Array.isArray(parsed)) {
                          // 파싱된 배열에서 텍스트 추출
                          return parsed
                            .map((item: any) => {
                              if (typeof item === "string") return item;
                              if (item.type === "text" && item.content)
                                return item.content;
                              if (item.type === "image") return "[이미지]";
                              return "";
                            })
                            .filter(Boolean)
                            .join("\n");
                        }
                      } catch {
                        // 파싱 실패시 원본 반환
                        return content;
                      }
                    }

                    // content가 이미 배열인 경우
                    if (Array.isArray(content)) {
                      return content
                        .map((item: any) => {
                          if (typeof item === "string") return item;
                          if (item.type === "text" && item.content)
                            return item.content;
                          if (item.type === "image") return "[이미지]";
                          return "";
                        })
                        .filter(Boolean)
                        .join("\n");
                    }

                    // 일반 문자열인 경우
                    if (typeof content === "string") {
                      return content;
                    }

                    // 기타 경우
                    return JSON.stringify(content);
                  })()}
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                onClick={() => setSelectedComment(null)}
                style={styles.cancelButton}
              >
                닫기
              </button>
              {!selectedComment.is_deleted && (
                <button
                  onClick={() => {
                    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
                      deleteMutation.mutate(selectedComment.id);
                      setSelectedComment(null);
                    }
                  }}
                  style={styles.deleteButton}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "삭제 중..." : "댓글 삭제"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAuthor && (
        <div style={styles.modal} onClick={() => setSelectedAuthor(null)}>
          <div
            style={{
              ...styles.modalContent,
              maxWidth: "700px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                ...styles.modalHeader,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderBottom: `1px solid ${colors.gray[200]}`,
              }}
            >
              <h2 style={{ ...styles.modalTitle, margin: 0 }}>
                작성자 상세 정보
              </h2>
              <button
                onClick={() => setSelectedAuthor(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px",
                  color: colors.gray[600],
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                ...styles.modalBody,
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <AuthorDetailContent
                authorId={selectedAuthor.author_id}
                authorName={selectedAuthor.author_name}
              />
            </div>
            <div
              style={{
                ...styles.modalFooter,
                flexShrink: 0,
                borderTop: `1px solid ${colors.gray[200]}`,
                padding: "16px 20px",
              }}
            >
              <button
                onClick={() => setSelectedAuthor(null)}
                style={styles.cancelButton}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Author Detail Component
const AuthorDetailContent: React.FC<{
  authorId: string;
  authorName: string;
}> = ({ authorId, authorName }) => {
  const [commentsPage, setCommentsPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userDetail", authorId],
    queryFn: async () => {
      try {
        return await api.getUserDetail(authorId);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        throw error;
      }
    },
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["userComments", authorId, commentsPage],
    queryFn: async () => {
      // getCommentsList(page, pageSize, search, authorSearch, targetId, targetType, isDeleted, sort)
      return await api.getCommentsList(
        commentsPage,
        5,
        undefined,
        authorId,
        undefined,
        undefined,
        undefined,
        "created_at_desc",
        false,
      );
    },
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", authorId, postsPage],
    queryFn: async () => {
      // getCommunityPosts(page, pageSize, search, authorId, category, sort)
      return await api.getCommunityPosts(
        postsPage,
        5,
        undefined,
        authorId,
        undefined,
        "created_at_desc",
      );
    },
  });

  // Update displayed comments when new data arrives
  useEffect(() => {
    if (commentsData?.comments && Array.isArray(commentsData.comments)) {
      if (commentsPage === 1) {
        setDisplayedComments(commentsData.comments);
      } else {
        setDisplayedComments((prev) => {
          // Ensure commentsData.comments is an array
          const newComments = Array.isArray(commentsData.comments)
            ? commentsData.comments
            : [];
          return [...prev, ...newComments];
        });
      }
    }
  }, [commentsData, commentsPage]);

  // Update displayed posts when new data arrives
  useEffect(() => {
    if (postsData?.posts && Array.isArray(postsData.posts)) {
      if (postsPage === 1) {
        setDisplayedPosts(postsData.posts);
      } else {
        setDisplayedPosts((prev) => {
          // Ensure postsData.posts is an array
          const newPosts = Array.isArray(postsData.posts)
            ? postsData.posts
            : [];
          return [...prev, ...newPosts];
        });
      }
    }
  }, [postsData, postsPage]);

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        사용자 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            padding: "16px",
            backgroundColor: colors.red[50],
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <p style={{ margin: 0, color: colors.red[700] }}>
            사용자 상세 정보를 불러올 수 없습니다.
          </p>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              color: colors.red[600],
            }}
          >
            기본 정보만 표시됩니다.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: "12px",
            padding: "16px",
            backgroundColor: colors.gray[50],
            borderRadius: "8px",
          }}
        >
          <div style={{ fontWeight: "600", color: colors.gray[600] }}>
            사용자 ID
          </div>
          <div>{authorId}</div>
          <div style={{ fontWeight: "600", color: colors.gray[600] }}>
            사용자명
          </div>
          <div>{authorName}</div>
        </div>
      </div>
    );
  }

  const user = userData?.user || userData;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          gap: "12px",
          padding: "16px",
          backgroundColor: colors.gray[50],
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        <div style={{ fontWeight: "600", color: colors.gray[600] }}>
          사용자 ID
        </div>
        <div>{user.id || authorId}</div>

        <div style={{ fontWeight: "600", color: colors.gray[600] }}>
          사용자명
        </div>
        <div>{user.name || authorName}</div>

        <div style={{ fontWeight: "600", color: colors.gray[600] }}>상태</div>
        <div>
          {user.is_banned ? (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: colors.red[100],
                color: colors.red[600],
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              차단됨
            </span>
          ) : user.is_deleted ? (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: colors.gray[200],
                color: colors.gray[600],
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              탈퇴
            </span>
          ) : (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: colors.green[100],
                color: colors.green[600],
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              활성
            </span>
          )}
        </div>

        {user.subscription_status && (
          <>
            <div style={{ fontWeight: "600", color: colors.gray[600] }}>
              구독 상태
            </div>
            <div>
              <span
                style={{
                  padding: "2px 8px",
                  backgroundColor:
                    user.subscription_status === "active"
                      ? colors.blue[100]
                      : colors.gray[100],
                  color:
                    user.subscription_status === "active"
                      ? colors.blue[600]
                      : colors.gray[600],
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {user.subscription_status === "active" ? "활성" : "비활성"}
              </span>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: "16px" }}>
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "600",
            marginBottom: "10px",
            color: colors.gray[700],
          }}
        >
          최근 활동
        </h3>

        <div style={{ marginBottom: "16px" }}>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              color: colors.gray[600],
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>댓글</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "normal",
                padding: "2px 8px",
                backgroundColor: colors.blue[100],
                color: colors.blue[600],
                borderRadius: "12px",
              }}
            >
              전체 {commentsData?.total_count || 0}개
            </span>
          </h4>
          {displayedComments.length > 0 ? (
            <div
              style={{
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {displayedComments.map((comment: any, index: number) => {
                // Parse comment content
                let displayContent = "";
                if (typeof comment.content === "string") {
                  if (
                    comment.content.startsWith("[") &&
                    comment.content.endsWith("]")
                  ) {
                    try {
                      const parsed = JSON.parse(comment.content);
                      if (Array.isArray(parsed)) {
                        displayContent = parsed
                          .map((item: any) => {
                            if (typeof item === "string") return item;
                            if (item.type === "text" && item.content)
                              return item.content;
                            if (item.type === "image") return "[이미지]";
                            return "";
                          })
                          .filter(Boolean)
                          .join(" ");
                      } else {
                        displayContent = comment.content;
                      }
                    } catch {
                      displayContent = comment.content;
                    }
                  } else {
                    displayContent = comment.content;
                  }
                } else if (Array.isArray(comment.content)) {
                  displayContent = comment.content
                    .map((item: any) => {
                      if (typeof item === "string") return item;
                      if (item.type === "text" && item.content)
                        return item.content;
                      if (item.type === "image") return "[이미지]";
                      return "";
                    })
                    .filter(Boolean)
                    .join(" ");
                }

                return (
                  <div
                    key={comment.id}
                    style={{
                      padding: "12px",
                      borderBottom:
                        index < displayedComments.length - 1
                          ? `1px solid ${colors.gray[100]}`
                          : "none",
                      backgroundColor:
                        index % 2 === 0 ? colors.gray[50] : colors.white,
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.gray[100];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? colors.gray[50] : colors.white;
                    }}
                    onClick={() => {
                      // Navigate to the full URL
                      if (comment.target_type === "news" && comment.target_id) {
                        window.open(
                          `https://www.saveticker.com/news/${comment.target_id}`,
                          "_blank",
                        );
                      } else if (
                        comment.target_type === "community" &&
                        comment.target_id
                      ) {
                        window.open(
                          `https://www.saveticker.com/community/${comment.target_id}`,
                          "_blank",
                        );
                      }
                    }}
                    title="클릭하여 게시글로 이동"
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "2px 6px",
                          backgroundColor:
                            comment.target_type === "news"
                              ? colors.blue[100]
                              : colors.green[100],
                          color:
                            comment.target_type === "news"
                              ? colors.blue[600]
                              : colors.green[600],
                          borderRadius: "3px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {comment.target_type === "news" ? "뉴스" : "커뮤니티"}
                      </span>
                      <span
                        style={{ fontSize: "11px", color: colors.gray[500] }}
                      >
                        {new Date(comment.created_at).toLocaleDateString(
                          "ko-KR",
                        )}
                      </span>
                    </div>
                    {comment.target_title && (
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: colors.gray[700],
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {comment.target_title}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "13px",
                        color: colors.gray[600],
                        lineHeight: "1.4",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {displayContent || "내용 없음"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: colors.gray[500],
                backgroundColor: colors.gray[50],
                borderRadius: "6px",
                border: `1px solid ${colors.gray[200]}`,
              }}
            >
              작성한 댓글이 없습니다.
            </div>
          )}
          {commentsData &&
            Number(commentsData.total_count) > displayedComments.length && (
              <div style={{ textAlign: "center", padding: "8px" }}>
                <button
                  onClick={() => setCommentsPage((prev) => prev + 1)}
                  disabled={commentsLoading}
                  style={{
                    padding: "6px 16px",
                    fontSize: "13px",
                    color: colors.primary,
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.primary}`,
                    borderRadius: "4px",
                    cursor: commentsLoading ? "not-allowed" : "pointer",
                    opacity: commentsLoading ? 0.5 : 1,
                  }}
                >
                  {commentsLoading
                    ? "불러오는 중..."
                    : `더 보기 (${displayedComments.length}/${commentsData.total_count})`}
                </button>
              </div>
            )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              color: colors.gray[600],
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>게시글</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "normal",
                padding: "2px 8px",
                backgroundColor: colors.green[100],
                color: colors.green[600],
                borderRadius: "12px",
              }}
            >
              전체 {postsData?.total_count || 0}개
            </span>
          </h4>
          {displayedPosts.length > 0 ? (
            <div
              style={{
                border: `1px solid ${colors.gray[200]}`,
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {displayedPosts.map((post: any, index: number) => (
                <div
                  key={post.id}
                  style={{
                    padding: "12px",
                    borderBottom:
                      index < displayedPosts.length - 1
                        ? `1px solid ${colors.gray[100]}`
                        : "none",
                    backgroundColor:
                      index % 2 === 0 ? colors.gray[50] : colors.white,
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.gray[100];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? colors.gray[50] : colors.white;
                  }}
                  onClick={() => {
                    // Navigate to the full URL
                    window.open(
                      `https://www.saveticker.com/community/${post.id}`,
                      "_blank",
                    );
                  }}
                  title="클릭하여 게시글로 이동"
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: colors.gray[800],
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: colors.gray[500] }}>
                      {new Date(post.created_at).toLocaleDateString("ko-KR")}
                    </span>
                    <div
                      style={{
                        fontSize: "11px",
                        color: colors.gray[600],
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <span>조회 {post.view_count || 0}</span>
                      <span>좋아요 {post.like_count || 0}</span>
                      <span>댓글 {post.comment_count || 0}</span>
                    </div>
                  </div>
                  {post.content && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.gray[600],
                        lineHeight: "1.4",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {(() => {
                        let contentText = "";
                        if (typeof post.content === "string") {
                          if (
                            post.content.startsWith("[") &&
                            post.content.endsWith("]")
                          ) {
                            try {
                              const parsed = JSON.parse(post.content);
                              if (Array.isArray(parsed)) {
                                contentText = parsed
                                  .map((item: any) => {
                                    if (typeof item === "string") return item;
                                    if (item.type === "text" && item.content)
                                      return item.content;
                                    return "";
                                  })
                                  .filter(Boolean)
                                  .join(" ");
                              } else {
                                contentText = post.content;
                              }
                            } catch {
                              contentText = post.content;
                            }
                          } else {
                            contentText = post.content;
                          }
                        } else if (Array.isArray(post.content)) {
                          contentText = post.content
                            .map((item: any) => {
                              if (typeof item === "string") return item;
                              if (item.type === "text" && item.content)
                                return item.content;
                              return "";
                            })
                            .filter(Boolean)
                            .join(" ");
                        }
                        return contentText || "";
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: colors.gray[500],
                backgroundColor: colors.gray[50],
                borderRadius: "6px",
                border: `1px solid ${colors.gray[200]}`,
              }}
            >
              작성한 게시글이 없습니다.
            </div>
          )}
          {postsData &&
            Number(postsData.total_count) > displayedPosts.length && (
              <div style={{ textAlign: "center", padding: "8px" }}>
                <button
                  onClick={() => setPostsPage((prev) => prev + 1)}
                  disabled={postsLoading}
                  style={{
                    padding: "6px 16px",
                    fontSize: "13px",
                    color: colors.primary,
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.primary}`,
                    borderRadius: "4px",
                    cursor: postsLoading ? "not-allowed" : "pointer",
                    opacity: postsLoading ? 0.5 : 1,
                  }}
                >
                  {postsLoading
                    ? "불러오는 중..."
                    : `더 보기 (${displayedPosts.length}/${postsData.total_count})`}
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Deleted Items Management Component
const DeletedItemsManagement: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "news" | "users" | "community" | "comments"
  >("news");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const queryClient = useQueryClient();

  // API 호출 쿼리들
  // 주의: include_deleted=true는 삭제된 것을 "포함"하는 것이지 "삭제된 것만" 보는 게 아님
  // 백엔드에 is_deleted=true 또는 deleted_only=true 파라미터가 필요할 수 있음
  const newsQuery = useQuery({
    queryKey: ["deletedNews", page, searchQuery],
    queryFn: async () => {
      // include_deleted=true로 모든 항목을 가져온 후 프론트에서 필터링
      const data = await api.getNews(
        searchQuery,
        page,
        20,
        "created_at_desc",
        true,
      );
      console.log("News API Response:", data);
      return data;
    },
    enabled: activeSubTab === "news",
  });

  const usersQuery = useQuery({
    queryKey: ["deletedUsers", page, searchQuery],
    queryFn: async () => {
      const data = await api.getUserList(
        page,
        20,
        searchQuery,
        undefined,
        undefined,
        "created_at_desc",
        true,
      );
      console.log("Users API Response:", data);
      return data;
    },
    enabled: activeSubTab === "users",
  });

  const communityQuery = useQuery({
    queryKey: ["deletedCommunity", page, searchQuery],
    queryFn: async () => {
      const data = await api.getCommunityPosts(
        page,
        20,
        searchQuery,
        undefined,
        undefined,
        "created_at_desc",
        true,
      );
      console.log("Community API Response:", data);
      return data;
    },
    enabled: activeSubTab === "community",
  });

  const commentsQuery = useQuery({
    queryKey: ["deletedComments", page, searchQuery],
    queryFn: async () => {
      // 댓글은 is_deleted 파라미터를 true로 설정
      const data = await api.getCommentsList(
        page,
        20,
        searchQuery,
        undefined,
        undefined,
        undefined,
        true,
        "created_at_desc",
        true,
      );
      console.log("Comments API Response:", data);
      // 개별 댓글 데이터 구조 확인
      if (data?.comments && data.comments.length > 0) {
        console.log("First comment structure:", data.comments[0]);
      }
      return data;
    },
    enabled: activeSubTab === "comments",
  });

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const renderNewsTab = () => {
    const data = newsQuery.data;
    const isLoading = newsQuery.isLoading;
    // include_deleted=true로 받은 데이터가 이미 삭제된 것들일 수 있음
    const allNews = data?.news_list || [];
    // is_deleted 필드가 없으면 모든 항목이 삭제된 것으로 간주
    const filteredNews = allNews;

    return (
      <div>
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            데이터를 불러오는 중...
          </div>
        ) : filteredNews.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeader}>제목</th>
                  <th style={styles.tableHeader}>카테고리</th>
                  <th style={styles.tableHeader}>작성자</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((news: any) => (
                  <tr key={news.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{news.title}</td>
                    <td style={styles.tableCell}>{news.category || "-"}</td>
                    <td style={styles.tableCell}>{news.author_name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            <div>삭제된 뉴스가 없습니다.</div>
            <div
              style={{
                fontSize: "12px",
                marginTop: "8px",
                color: colors.gray[400],
              }}
            >
              전체 {allNews.length}개 중 삭제된 항목: {filteredNews.length}개
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUsersTab = () => {
    const data = usersQuery.data;
    const isLoading = usersQuery.isLoading;
    // include_deleted=true로 받은 데이터
    const allUsers = data?.users || [];
    const filteredUsers = allUsers;

    return (
      <div>
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            데이터를 불러오는 중...
          </div>
        ) : filteredUsers.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeader}>이름</th>
                  <th style={styles.tableHeader}>이메일</th>
                  <th style={styles.tableHeader}>역할</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{user.username || "-"}</td>
                    <td style={styles.tableCell}>{user.email || "-"}</td>
                    <td style={styles.tableCell}>{user.role || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            <div>삭제된 회원이 없습니다.</div>
            <div
              style={{
                fontSize: "12px",
                marginTop: "8px",
                color: colors.gray[400],
              }}
            >
              전체 {allUsers.length}개 중 삭제된 항목: {filteredUsers.length}개
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCommunityTab = () => {
    const data = communityQuery.data;
    const isLoading = communityQuery.isLoading;
    // include_deleted=true로 받은 데이터
    const allPosts = data?.posts || [];
    const filteredPosts = allPosts;

    return (
      <div>
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            데이터를 불러오는 중...
          </div>
        ) : filteredPosts.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeader}>제목</th>
                  <th style={styles.tableHeader}>카테고리</th>
                  <th style={styles.tableHeader}>작성자</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post: any) => (
                  <tr key={post.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>{post.title}</td>
                    <td style={styles.tableCell}>{post.category || "-"}</td>
                    <td style={styles.tableCell}>{post.author_name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            <div>삭제된 커뮤니티 게시글이 없습니다.</div>
            <div
              style={{
                fontSize: "12px",
                marginTop: "8px",
                color: colors.gray[400],
              }}
            >
              전체 {allPosts.length}개 중 삭제된 항목: {filteredPosts.length}개
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCommentsTab = () => {
    const data = commentsQuery.data;
    const isLoading = commentsQuery.isLoading;
    const allComments: any[] = Array.isArray(data?.comments)
      ? data?.comments || []
      : [];
    // 댓글은 is_deleted=true 파라미터로 삭제된 것만 가져옴
    const filteredComments: any[] = allComments;

    return (
      <div>
        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            데이터를 불러오는 중...
          </div>
        ) : filteredComments.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.tableHeader}>내용</th>
                  <th style={styles.tableHeader}>타입</th>
                  <th style={styles.tableHeader}>작성자</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.map((comment: any) => (
                  <tr key={comment.id} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <div
                        style={{
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {(() => {
                          // 댓글 내용 처리 - 다양한 형식 지원
                          if (
                            typeof comment.content === "string" &&
                            comment.content.trim()
                          ) {
                            return comment.content;
                          } else if (Array.isArray(comment.content)) {
                            // content가 배열인 경우 (rich text)
                            const textContent = comment.content
                              .map((item: any) => {
                                if (typeof item === "string") return item;
                                if (item.type === "text") return item.content;
                                return "";
                              })
                              .filter(Boolean)
                              .join(" ");
                            return textContent || "내용 없음";
                          } else if (comment.comment_text) {
                            return comment.comment_text;
                          } else if (comment.text) {
                            return comment.text;
                          } else {
                            return "내용 없음";
                          }
                        })()}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          backgroundColor:
                            comment.target_type === "news"
                              ? colors.blue[100]
                              : colors.green[100],
                          color:
                            comment.target_type === "news"
                              ? colors.blue[600]
                              : colors.green[600],
                        }}
                      >
                        {comment.target_type === "news" ? "뉴스" : "커뮤니티"}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {comment.author_name || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: colors.gray[500],
            }}
          >
            <div>삭제된 댓글이 없습니다.</div>
            <div
              style={{
                fontSize: "12px",
                marginTop: "8px",
                color: colors.gray[400],
              }}
            >
              전체 {allComments.length}개 중 삭제된 항목:{" "}
              {filteredComments.length}개
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          color: colors.gray[800],
        }}
      >
        삭제된 항목 관리
      </h1>

      {/* 서브 탭 */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: `2px solid ${colors.gray[200]}`,
        }}
      >
        {[
          { id: "news" as const, label: "뉴스" },
          // { id: 'users' as const, label: '회원' },
          { id: "community" as const, label: "커뮤니티" },
          { id: "comments" as const, label: "댓글" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id);
              setPage(1);
              setSearchQuery("");
              setSearchInput("");
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              border: "none",
              borderBottom:
                activeSubTab === tab.id
                  ? `2px solid ${colors.primary}`
                  : "2px solid transparent",
              color:
                activeSubTab === tab.id ? colors.primary : colors.gray[600],
              fontWeight: activeSubTab === tab.id ? "600" : "400",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 검색 바 */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: `1px solid ${colors.gray[300]}`,
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 24px",
            backgroundColor: colors.primary,
            color: colors.white,
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          검색
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div
        style={{
          backgroundColor: colors.white,
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        {activeSubTab === "news" && renderNewsTab()}
        {/* {activeSubTab === 'users' && renderUsersTab()} */}
        {activeSubTab === "community" && renderCommunityTab()}
        {activeSubTab === "comments" && renderCommentsTab()}
      </div>

      {/* 페이지네이션 */}
      {((activeSubTab === "news" && newsQuery.data?.total_pages > 1) ||
        // (activeSubTab === 'users' && usersQuery.data?.total_pages > 1) ||
        (activeSubTab === "community" &&
          communityQuery.data?.total_pages > 1) ||
        (activeSubTab === "comments" &&
          (commentsQuery.data as any)?.total_pages > 1)) && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px",
              backgroundColor: page === 1 ? colors.gray[100] : colors.white,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "4px",
              cursor: page === 1 ? "not-allowed" : "pointer",
              color: page === 1 ? colors.gray[400] : colors.gray[700],
            }}
          >
            이전
          </button>
          <span style={{ padding: "8px 16px", color: colors.gray[700] }}>
            페이지 {page}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={
              (activeSubTab === "news" &&
                page >= (newsQuery.data?.total_pages || 1)) ||
              // (activeSubTab === 'users' && page >= (usersQuery.data?.total_pages || 1)) ||
              (activeSubTab === "community" &&
                page >= (communityQuery.data?.total_pages || 1)) ||
              (activeSubTab === "comments" &&
                page >= ((commentsQuery.data as any)?.total_pages || 1))
            }
            style={{
              padding: "8px 16px",
              backgroundColor: colors.white,
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: "4px",
              cursor: "pointer",
              color: colors.gray[700],
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

// Main Admin Component
const AdminApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("news");
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-user-dropdown]")) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "statistics":
        return <StatisticsManagement />;
      case "news":
        return <NewsManagement />;
      case "report":
        return <ReportManagement />;
      case "user":
        return <UserManagement />;
      case "calendar":
        return <CalendarManagement />;
      case "community":
        return <CommunityManagement />;
      case "customer-support":
        return <CustomerSupportManagement />;
      case "tags":
        return <TagManagement />;
      case "terms":
        return <TermsManagement />;
      case "reports":
        return <UserReportsManagement />;
      case "comments":
        return <CommentsManagement />;
      case "deleted":
        return <DeletedItemsManagement />;
      default:
        return <StatisticsManagement />;
    }
  };

  const userInfo = (() => {
    try {
      const info = localStorage.getItem("user_info");
      return info ? JSON.parse(info) : {};
    } catch {
      return {};
    }
  })();

  return (
    <QueryClientProvider client={queryClient}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
              <div style={styles.logo} className="desktop-only">
                SAVENEWS
              </div>
            </div>

            <nav style={styles.nav} className="desktop-only">
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "news" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "news" && activeTab !== "news"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("news")}
                onMouseEnter={() => setHoveredNavItem("news")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                뉴스 관리
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "report" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "report" && activeTab !== "report"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("report")}
                onMouseEnter={() => setHoveredNavItem("report")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                리포트 관리
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "user" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "user" && activeTab !== "user"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("user")}
                onMouseEnter={() => setHoveredNavItem("user")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                회원 관리
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "calendar" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "calendar" && activeTab !== "calendar"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("calendar")}
                onMouseEnter={() => setHoveredNavItem("calendar")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                캘린더
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "community" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "community" &&
                  activeTab !== "community"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("community")}
                onMouseEnter={() => setHoveredNavItem("community")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                커뮤니티
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "customer-support" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "customer-support" &&
                  activeTab !== "customer-support"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("customer-support")}
                onMouseEnter={() => setHoveredNavItem("customer-support")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                고객센터
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "comments" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "comments" && activeTab !== "comments"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("comments")}
                onMouseEnter={() => setHoveredNavItem("comments")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                댓글 관리
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "tags" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "tags" && activeTab !== "tags"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("tags")}
                onMouseEnter={() => setHoveredNavItem("tags")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                태그 관리
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "terms" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "terms" && activeTab !== "terms"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("terms")}
                onMouseEnter={() => setHoveredNavItem("terms")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                약관 설정
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "reports" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "reports" && activeTab !== "reports"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("reports")}
                onMouseEnter={() => setHoveredNavItem("reports")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                신고 관리
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "deleted" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "deleted" && activeTab !== "deleted"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("deleted")}
                onMouseEnter={() => setHoveredNavItem("deleted")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                삭제 목록
              </button>
              <button
                style={{
                  ...styles.navItem,
                  ...(activeTab === "statistics" ? styles.navItemActive : {}),
                  ...(hoveredNavItem === "statistics" &&
                  activeTab !== "statistics"
                    ? styles.navItemHover
                    : {}),
                }}
                onClick={() => setActiveTab("statistics")}
                onMouseEnter={() => setHoveredNavItem("statistics")}
                onMouseLeave={() => setHoveredNavItem(null)}
              >
                통계
              </button>
            </nav>

            <div
              style={{ position: "relative", marginLeft: "auto" }}
              data-user-dropdown
            >
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  backgroundColor: "transparent",
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: colors.gray[700],
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.gray[50];
                  e.currentTarget.style.borderColor = colors.gray[400];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = colors.gray[300];
                }}
              >
                <span
                  style={{
                    maxWidth: "80px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userInfo.email || "Admin"}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    transform: userDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "4px",
                    minWidth: "200px",
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.gray[200]}`,
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: `1px solid ${colors.gray[200]}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.gray[500],
                        marginBottom: "4px",
                      }}
                    >
                      로그인 계정
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: colors.gray[800],
                        wordBreak: "break-all",
                      }}
                    >
                      {userInfo.email || "Admin"}
                    </div>
                    {userInfo.name && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: colors.gray[600],
                          marginTop: "4px",
                        }}
                      >
                        {userInfo.name}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "0 0 8px 8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: colors.error,
                      textAlign: "left",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.red[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={styles.content}>{renderContent()}</main>
      </div>
    </QueryClientProvider>
  );
};

export default AdminApp;
