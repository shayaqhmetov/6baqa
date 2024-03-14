"use client"

import { useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

import { getToken } from "@/lib/auth"
import { LoginForm } from "@/components/forms/login-form";
import { tokenAtom } from "@/states/auth";


export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useAtom(tokenAtom);

  useEffect(() => {
    // Check if token exists in local storage
    const token = getToken();

    // If token exists, redirect to another page
    if (token) {
      setToken(token);
      router.push('/');
    }
  }, [router, setToken]);

  // Render null if token exists (until useEffect executes)
  if (token) {
    return null;
  }

  return <div className="login-page">
    <h1>Login</h1>
    <LoginForm></LoginForm>
  </div>;
}