export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}
