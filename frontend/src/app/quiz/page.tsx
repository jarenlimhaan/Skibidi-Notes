"use client";

import Quiz from '@/components/quiz'; 
import withoutAuth from '@/components/auth/unAuthGuard';

function QuizPage() {
  return (
    <div>
      <Quiz />
    </div>
  );
}

export default withoutAuth(QuizPage);