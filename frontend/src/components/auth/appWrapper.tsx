"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter, usePathname } from "next/navigation";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth(); // Sets `isAuthenticated` in your store
  }, [checkAuth]);

  useEffect(() => {
    // Example: redirect logic after auth check
    if (pathname === "/") {
      if (isAuthenticated === false) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
