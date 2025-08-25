/**
 * Admin API utilities
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.saveticker.com';

// Export for use in other files
export const getApiBaseUrl = () => API_BASE_URL;

/**
 * 공통 API 호출 함수
 * @param endpoint API 엔드포인트 (예: '/api/auth/login')
 * @param options fetch 옵션 (method, body, headers 등)
 * @returns Promise<any> API 응답 데이터
 */
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/';
    }
    console.error('API Error:', {
      status: response.status,
      endpoint,
      errorData,
      body: options.body
    });
    throw new Error(errorData?.detail || errorData?.message || `API Error: ${response.status}`);
  }
  
  return response.json();
};

// Auth APIs
export const login = async (email: string, password: string) => {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// News content types
export interface NewsContentText {
  type: 'text';
  content: string;
}

export interface NewsContentImage {
  type: 'image';
  url: string;
  alt: string | null;
}

export type NewsContent = NewsContentText | NewsContentImage;

export interface NewsData {
  title: string;
  content: NewsContent[];
  category?: string;
  source: string;
  tags: string[];
  thumbnail?: string;
}

// News APIs
export const getNews = async (search?: string, page: number = 1, pageSize: number = 20, sort: string = 'created_at_desc') => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort: sort,
  });
  if (search && search.trim() !== '') {
    params.append('search', search.trim());
  }
  
  console.log('Fetching news with params:', params.toString());
  return apiCall(`/api/news/list?${params}`);
};

export const getNewsDetail = async (newsId: string) => {
  return apiCall(`/api/news/detail/${newsId}`);
};

export const createNews = async (newsData: NewsData) => {
  return apiCall('/admin-api/news/create', {
    method: 'POST',
    body: JSON.stringify(newsData),
  });
};

export const updateNews = async (newsId: string, newsData: NewsData) => {
  return apiCall(`/admin-api/news/update/${newsId}`, {
    method: 'PUT',
    body: JSON.stringify(newsData),
  });
};

export const deleteNews = async (newsId: string) => {
  return apiCall(`/admin-api/news/delete/${newsId}`, {
    method: 'DELETE',
  });
};

// Report content types (same as News)
export interface ReportContentText {
  type: 'text';
  content: string;
}

export interface ReportContentImage {
  type: 'image';
  url: string;
  alt: string | null;
}

export type ReportContent = ReportContentText | ReportContentImage;

export interface ReportData {
  title: string;
  content: ReportContent[];
  pdf_url?: string;
  tags: string[];
}

// Report APIs
export const getReports = async (search?: string, page: number = 1, pageSize: number = 20, sort: string = 'created_at_desc') => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort: sort,
  });
  if (search) params.append('search', search);
  
  return apiCall(`/api/reports/list?${params}`);
};

export const getReportDetail = async (reportId: string) => {
  return apiCall(`/api/reports/detail/${reportId}`);
};

export const createReport = async (reportData: ReportData) => {
  return apiCall('/admin-api/reports/create', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
};

export const updateReport = async (reportId: string, reportData: ReportData) => {
  return apiCall(`/admin-api/reports/update/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(reportData),
  });
};

export const deleteReport = async (reportId: string) => {
  return apiCall(`/admin-api/reports/delete/${reportId}`, {
    method: 'DELETE',
  });
};

// User APIs
export interface UserStatusUpdate {
  is_banned?: boolean;
  role?: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  ban_reason?: string;
}

export const getUserList = async (
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  role?: string,
  isBanned?: boolean,
  sort: string = 'created_at_desc'
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort: sort,
  });
  
  if (search && search.trim() !== '') {
    params.append('search', search.trim());
  }
  if (role) {
    params.append('role', role);
  }
  if (isBanned !== undefined) {
    params.append('is_banned', isBanned.toString());
  }
  
  return apiCall(`/admin-api/user/list?${params}`);
};

export const getUserDetail = async (userId: string) => {
  return apiCall(`/admin-api/user/detail/${userId}`);
};

export const updateUserStatus = async (userId: string, statusData: UserStatusUpdate) => {
  return apiCall(`/admin-api/user/status/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  });
};

// Legacy user APIs (keep for backward compatibility)
export const getUsers = async (page: number = 1, pageSize: number = 20) => {
  return getUserList(page, pageSize);
};

export const updateUser = async (userId: string, userData: any) => {
  return updateUserStatus(userId, userData);
};

export const deleteUser = async (userId: string) => {
  return apiCall(`/api/users/${userId}`, {
    method: 'DELETE',
  });
};

// Calendar content types (same as News/Report)
export interface CalendarContentText {
  type: 'text';
  content: string;
}

export interface CalendarContentImage {
  type: 'image';
  url: string;
  alt: string | null;
}

export type CalendarContent = CalendarContentText | CalendarContentImage;

export interface CalendarEventData {
  title: string;
  content: CalendarContent[];
  event_date: string;
  color?: string;
}

// Calendar APIs
export const getCalendarEvents = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  
  // 날짜를 YYYY-MM-DD 형식으로 전달
  if (startDate && startDate.trim() !== '') {
    params.append('start_date', startDate);
  }
  if (endDate && endDate.trim() !== '') {
    params.append('end_date', endDate);
  }
  
  const url = `/api/calendar/events?${params}`;
  console.log('Calendar API URL:', url);
  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);
  
  return apiCall(url);
};

export const createCalendarEvent = async (eventData: CalendarEventData) => {
  return apiCall('/admin-api/calendar/create', {
    method: 'POST',
    body: JSON.stringify(eventData),
  });
};

export const updateCalendarEvent = async (eventId: string, eventData: CalendarEventData) => {
  return apiCall(`/admin-api/calendar/update/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  });
};

export const deleteCalendarEvent = async (eventId: string) => {
  return apiCall(`/admin-api/calendar/delete/${eventId}`, {
    method: 'DELETE',
  });
};

// Tag APIs
export interface TagData {
  name: string;
  description?: string;
  is_required?: boolean;
  is_ticker?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  is_required: boolean;
  is_ticker: boolean;
  created_at: string;
  updated_at: string;
}

export const getTags = async (required?: boolean) => {
  const params = new URLSearchParams();
  if (required !== undefined) {
    params.append('required', required.toString());
  }
  
  return apiCall(`/api/tags/list?${params}`);
};

export const createTag = async (tagData: TagData) => {
  return apiCall('/admin-api/tags/create', {
    method: 'POST',
    body: JSON.stringify(tagData),
  });
};

export const updateTag = async (tagId: string, tagData: TagData) => {
  return apiCall(`/admin-api/tags/update/${tagId}`, {
    method: 'PUT',
    body: JSON.stringify(tagData),
  });
};

export const deleteTag = async (tagId: string) => {
  return apiCall(`/admin-api/tags/delete/${tagId}`, {
    method: 'DELETE',
  });
};

// Upload APIs
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/admin-api/uploads/document`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/';
    }
    throw new Error(errorData?.detail || `Upload Error: ${response.status}`);
  }
  
  return response.json();
};

// Upload Image API
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  console.log('Uploading image to:', `${API_BASE_URL}/api/uploads/image`);
  console.log('File details:', { name: file.name, type: file.type, size: file.size });
  
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/api/uploads/image`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData,
  });
  
  console.log('Upload response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Upload error response:', errorData);
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/';
    }
    throw new Error(errorData?.detail || errorData?.message || `Upload Error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Upload success response:', data);
  return data;
};

// Community content types
export interface CommunityContentText {
  type: 'text';
  content: string;
}

export interface CommunityContentImage {
  type: 'image';
  url: string;
  alt: string | null;
}

export type CommunityContent = CommunityContentText | CommunityContentImage;

export interface CommunityPostData {
  title: string;
  content: CommunityContent[];
  category?: string;
  linked_news_id?: string;
  tags: string[];
}

export interface CommunityUpdateData {
  title: string;
  content: CommunityContent[];
  tags: string[];
}

// Community APIs
export const getCommunityPosts = async (
  page: number = 1, 
  pageSize: number = 20,
  search?: string,
  category?: string,
  sort: string = 'created_at_desc'
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort: sort,
  });
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  
  return apiCall(`/api/community/list?${params}`);
};

export const getCommunityDetail = async (postId: string) => {
  return apiCall(`/api/community/detail/${postId}`);
};

export const createCommunityPost = async (postData: CommunityPostData) => {
  return apiCall('/api/community/create', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
};

export const updateCommunityPost = async (postId: string, postData: CommunityUpdateData) => {
  return apiCall(`/api/community/update/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
};

export const deleteCommunityPost = async (postId: string) => {
  return apiCall(`/api/community/delete/${postId}`, {
    method: 'DELETE',
  });
};

export const getCommunityComments = async (postId: string) => {
  return apiCall(`/api/community/${postId}/comments`);
};

export const deleteCommunityComment = async (postId: string, commentId: string) => {
  return apiCall(`/api/community/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });
};

// Vote APIs
export interface VoteOption {
  key: string;
  label: string;
}

export interface VoteSettingData {
  target_id: string;
  title: string;
  description: string;
  options: VoteOption[];
  multiple_choice: boolean;
  end_date?: string;
}

export const createVoteSetting = async (data: VoteSettingData) => {
  return apiCall('/api/vote/settings/create', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Statistics APIs
export interface UserStatistics {
  online_users: number;
  today_active: number;
  week_active: number;
  month_active: number;
  total_users: number;
  new_users_today: number;
  new_users_week: number;
}

export interface PostStatistics {
  news_today: number;
  community_today: number;
  total_posts_today: number;
  news_week: number;
  community_week: number;
  total_posts_week: number;
  comments_today: number;
  total_news: number;
  total_community: number;
  total_comments: number;
}

export interface SystemStatistics {
  timestamp: string;
  user_statistics: UserStatistics;
  post_statistics: PostStatistics;
}

export const getSystemStatistics = async (): Promise<SystemStatistics> => {
  return apiCall('/admin-api/dashboard/statistics');
};

// Terms APIs
export interface TermsData {
  terms_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export const getAllTerms = async (): Promise<TermsData[]> => {
  return apiCall('/api/terms');
};

export const getSpecificTerms = async (termsIds: string[]): Promise<TermsData[]> => {
  return apiCall('/api/terms/specific', {
    method: 'POST',
    body: JSON.stringify({ terms_ids: termsIds }),
  });
};

export const createTerms = async (data: { terms_id: string; content: string }): Promise<TermsData> => {
  return apiCall('/admin-api/terms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateTerms = async (termsId: string, content: string): Promise<TermsData> => {
  return apiCall(`/admin-api/terms/${termsId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
};

export const deleteTerms = async (termsId: string): Promise<string> => {
  return apiCall(`/admin-api/terms/${termsId}`, {
    method: 'DELETE',
  });
};

// User Reports APIs
export interface UserReport {
  id: string;
  target_type: 'NEWS_COMMENT' | 'COMMUNITY_POST' | 'COMMUNITY_COMMENT' | 'USER';
  target_id: string;
  target_content?: string | any[] | any;  // 신고 대상 콘텐츠 (다양한 형태 가능)
  target_author?: string;   // 신고 대상 작성자
  target_author_id?: string;  // 신고 대상 작성자 ID
  target_title?: string;    // 게시글 제목 (게시글인 경우)
  reason: 'SPAM' | 'ABUSE' | 'INAPPROPRIATE' | 'COPYRIGHT' | 'OTHER';
  description: string;
  reporter_id: string;
  reporter_name?: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  admin_note?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserReportUpdate {
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  admin_note?: string;
  should_ban?: boolean;  // 차단 여부 추가
}

export const getUserReports = async (
  page: number = 1,
  pageSize: number = 20,
  statusFilter?: string,
  typeFilter?: string
): Promise<{ reports: UserReport[]; total_count: number; page: number; page_size: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  
  if (statusFilter) {
    params.append('status_filter', statusFilter);
  }
  if (typeFilter) {
    params.append('type_filter', typeFilter);
  }
  
  return apiCall(`/admin-api/user-reports/list?${params}`);
};

export const processUserReport = async (reportId: string, data: UserReportUpdate): Promise<string> => {
  return apiCall(`/admin-api/user-reports/process/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Comments API
export interface Comment {
  id: string;
  content: string;
  author_id: string;
  author_name: string;
  target_id: string;
  target_type: 'news' | 'community';
  target_title?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at?: string;
  like_count: number;
  dislike_count: number;
}

export interface CommentsResponse {
  comments: Comment[] | string;
  total_count: number | string;
  page?: number;
  page_size?: number;
}

export const getCommentsList = async (
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  authorId?: string,
  targetId?: string,
  targetType?: 'news' | 'community',
  isDeleted?: boolean,
  sort: 'created_at_desc' | 'created_at_asc' = 'created_at_desc'
): Promise<CommentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    sort: sort,
  });
  
  if (search) params.append('search', search);
  if (authorId) params.append('author_id', authorId);
  if (targetId) params.append('target_id', targetId);
  if (targetType) params.append('target_type', targetType);
  if (isDeleted !== undefined) params.append('is_deleted', isDeleted.toString());
  
  return apiCall(`/admin-api/comments/list?${params}`);
};

export const deleteComment = async (commentId: string): Promise<string> => {
  return apiCall(`/api/comments/delete/${commentId}`, {
    method: 'DELETE',
  });
};