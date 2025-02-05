export interface AuthResponse {
    id: string;
    userName: string;
    displayName: string;
    token: string;
    message: string;
    expire: number;
    isAuthenticated: boolean;
  }
  