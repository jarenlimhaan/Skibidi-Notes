"use client";

import QuizReview from "@/components/quiz_review";
import withAuth from "@/components/auth/authGuard";
import { useParams } from "next/navigation";

function QuizReviewPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  return (
    <div>
      <QuizReview id={id} />
    </div>
  );
}

export default withAuth(QuizReviewPage);
