// types/User.ts

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null; // ISO format string, e.g. "1990-01-01"
  timeCreate: string;         // ISO format string, e.g. "2024-08-02T07:29:18.675"
  timeUpdate: string;         // ISO format string, e.g. "2024-08-16T08:29:48.077"
  role: 'admin' | 'user' | 'moderator'; // extend if needed
  jwt: string;
};
