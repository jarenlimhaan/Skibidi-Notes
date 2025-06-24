"use client";

import Login from '@/components/login'; 
import withoutAuth from '@/components/auth/unAuthGuard';

function LoginPage() {
  return (
    <div>
      <Login />
    </div>
  );
}

export default withoutAuth(LoginPage);