// utils/apiClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';



const getAuthToken = (): string | null => {
  // Lấy token từ localStorage hoặc cookie
  return localStorage.getItem('authToken');
};
const API_URL = process.env.NEXT_PUBLIC_URL_API;
// Tạo instance axios cơ bản
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động gắn token
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung
const handleApiError = (error: AxiosError) => {
  if (error.response) {
    // Lỗi từ server (4xx, 5xx)
    const message = error.response.data || 'Request failed';
    const status = error.response.status;
    
    if (status === 401) {
      // Xử lý khi hết phiên (có thể redirect đến trang login)
      window.location.href = '/login';
    }
    
    throw new Error(`${status}: ${message}`);
  } else if (error.request) {
    // Không nhận được response từ server
    throw new Error('Network error - No response from server');
  } else {
    // Lỗi khi thiết lập request
    throw new Error('Request setup error');
  }
};

// Các phương thức HTTP common
export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
};