"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

const withoutAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated === true) {
        router.push("/account");
      }
    }, [isAuthenticated, router]);

    // Prevent render while checking
    if (isAuthenticated === null) {
      return <div>Loading...</div>;
    }

    // Prevent showing the login/register to authenticated users
    if (isAuthenticated === true) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withoutAuth;
