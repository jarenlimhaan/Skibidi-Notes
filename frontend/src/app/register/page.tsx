"use client";

import Register from '@/components/register'; 
import withoutAuth from '@/components/auth/unAuthGuard';

function RegisterPage() {
  return (
    <div>
      <Register />
    </div>
  );
}

export default withoutAuth(RegisterPage);