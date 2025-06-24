"use client";

import withAuth from "@/components/auth/authGuard";

function ProtectedPage() {
  return <div>This is a protected page visible only to authenticated users.</div>;
}

export default withAuth(ProtectedPage);
