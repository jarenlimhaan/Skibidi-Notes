"use client";

import withAuth from '@/components/auth/authGuard';
import { useParams } from 'next/navigation';

import Quiz from '@/components/quiz'; 

function QuizPage() {

  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  return (
    <div>
      <Quiz id={id}/>
    </div>
  );
}

export default withAuth(QuizPage);