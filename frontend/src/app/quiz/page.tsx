"use client";

import withAuth from '@/components/auth/authGuard';
import Quiz from '@/components/quiz'; 

function QuizPage() {
  return (
    <div>
      <Quiz />
    </div>
  );
}

export default withAuth(QuizPage);