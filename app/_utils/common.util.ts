export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};