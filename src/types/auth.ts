export interface iAuthResponse {
  access_token: string;
  user_id: string;
}

export interface iUser {
  username: string;
  password: string;
}

export interface iDecodedToken {
  user_id: string;
  username: string;
  role: string;
}
