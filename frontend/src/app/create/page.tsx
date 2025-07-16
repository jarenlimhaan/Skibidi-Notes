"use client";

import withAuth from '@/components/auth/authGuard';
import Create from '@/components/create'; // adjust if needed

function Page() {
  return (
    <div>
      <Create />
    </div>
  );
}

export default withAuth(Page);