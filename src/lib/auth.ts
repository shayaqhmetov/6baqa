import { iDecodedToken } from "@/types/auth";
import jwt from "jsonwebtoken";

export const decodeToken = (token: string): iDecodedToken => {
  return jwt.decode(token) as iDecodedToken;
};

export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const setToken = (token: string | null) => {
  if (token === null) {
    localStorage.removeItem("access_token");
    return;
  }
  localStorage.setItem("access_token", token);
};