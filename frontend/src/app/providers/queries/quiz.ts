'use client';

import { useQuery } from '@tanstack/react-query';

interface Quiz {
  id: string;
  upload_id: string;
  content: Question[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}


const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

async function fetchQuizzes(id: string): Promise<Quiz> {
  const response = await fetch(`${backendURL}/api/quiz/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz');
  }
  return response.json();
}

export function useQuiz(id: string) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => fetchQuizzes(id),
    enabled: !!id, 
  });
}
