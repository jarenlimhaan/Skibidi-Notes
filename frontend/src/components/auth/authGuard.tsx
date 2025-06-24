"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { isAuthenticated, checkAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated === false) {
        // Redirect only if we know user is NOT authenticated
        router.push("/login");
      }
      if (isAuthenticated === true) {
        router.push("/dashboard");
      }
    }, [isAuthenticated, router]);

    // Optionally, render nothing while loading (e.g. isAuthenticated === null)
    if (isAuthenticated === false) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
