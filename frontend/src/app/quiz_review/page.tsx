"use client";

import QuizReview from '@/components/quiz_review'; 
import withAuth from '@/components/auth/authGuard';

function QuizReviewPage() {
  return (
    <div>
      <QuizReview />
    </div>
  );
}

export default withAuth(QuizReviewPage);