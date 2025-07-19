export const getAuthToken = (): string | null => {
  // Ví dụ lấy từ localStorage
  return localStorage.getItem('authToken');
  // Hoặc từ cookie nếu bạn dùng Next.js
  // import { parseCookies } from 'nookies';
  // const cookies = parseCookies();
  // return cookies.authToken;
};