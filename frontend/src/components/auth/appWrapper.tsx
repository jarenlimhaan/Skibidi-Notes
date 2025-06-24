// _app.tsx or wherever your top layout is
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  return <>{children}</>;
}
