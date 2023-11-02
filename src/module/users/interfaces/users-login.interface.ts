export interface UserPaload {
  sub: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
}
