"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
  BookOpen,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar2";

import useRedirectDataStore from "@/app/store/redirectStore";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
}

// Sample user answers (1 correct out of 5)
// const sampleUserAnswers: UserAnswer[] = [
//   { questionId: 1, selectedAnswer: 0, isCorrect: false }, // Selected London instead of Paris
// ]

export default function QuizReview({ id }: { id: string }) {
  const { questions, answers } = useRedirectDataStore();
  const sampleQuestions: Question[] = questions;

  let sampleUserAnswers: UserAnswer[] = [];
  sampleQuestions.forEach((question, index) => {
    sampleUserAnswers.push({
      questionId: question.id,
      selectedAnswer: answers[index] !== undefined ? answers[index] : null,
      isCorrect: answers[index] === question.correctAnswer,
    });
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const totalQuestions = sampleQuestions.length;
  const correctAnswers = sampleUserAnswers.filter(
    (answer) => answer.isCorrect
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const currentQuestion = sampleQuestions[currentQuestionIndex];
  const currentUserAnswer = sampleUserAnswers[currentQuestionIndex];

  if (
    !sampleQuestions.length ||
    !sampleUserAnswers.length ||
    !sampleQuestions[currentQuestionIndex] ||
    !sampleUserAnswers[currentQuestionIndex]
  ) {
    return <div>Loading or invalid data</div>;
  }

  const getAnswerStatus = (optionIndex: number, questionIndex: number) => {
    const question = sampleQuestions[questionIndex];
    const userAnswer = sampleUserAnswers[questionIndex];

    const isCorrectAnswer = optionIndex === question.correctAnswer;
    const isUserSelection = optionIndex === userAnswer.selectedAnswer;

    if (isCorrectAnswer && isUserSelection) return "correct-selected";
    if (isCorrectAnswer) return "correct";
    if (isUserSelection) return "incorrect-selected";
    return "default";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "correct-selected":
        return "bg-green-50 border-green-400 text-green-800";
      case "correct":
        return "bg-green-50 border-green-400 text-green-800";
      case "incorrect-selected":
        return "bg-red-50 border-red-400 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct-selected":
      case "correct":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "incorrect-selected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  if (showAllQuestions) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 py-8 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllQuestions(false)}
                    className="rounded-xl bg-transparent border-purple-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Review
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      All Questions Summary
                    </h1>
                    <p className="text-gray-600">
                      Complete overview of your quiz performance
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    {percentage}%
                  </div>
                  <div className="text-gray-600">
                    {correctAnswers}/{totalQuestions} Correct
                  </div>
                </div>
              </div>
            </div>

            {/* All Questions */}
            <div className="space-y-6">
              {sampleQuestions.map((question, index) => {
                const userAnswer = sampleUserAnswers[index];
                return (
                  <div
                    key={question.id}
                    className="bg-white rounded-3xl p-6 shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            userAnswer.isCorrect
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Question {index + 1}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              question.difficulty === "Easy"
                                ? "bg-green-100 text-green-700"
                                : question.difficulty === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                      </div>
                      {userAnswer.isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>

                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      {question.question}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {question.options.map((option, optionIndex) => {
                        const status = getAnswerStatus(optionIndex, index);
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-xl border-2 ${getStatusStyles(status)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <span>{option}</span>
                              </div>
                              {getStatusIcon(status)}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                      <h5 className="font-medium text-blue-800 mb-1">
                        Explanation
                      </h5>
                      <p className="text-blue-700 text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="rounded-xl bg-transparent border-purple-300"
                  onClick={() => (window.location.href = `/quiz/${id}`)}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Quiz
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Review Answers
                  </h1>
                  <p className="text-gray-600">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {percentage}%
                </div>
                <div className="text-gray-600">Final Score</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {correctAnswers}
                </div>
                <div className="text-gray-600 text-sm">Correct</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {incorrectAnswers}
                </div>
                <div className="text-gray-600 text-sm">Incorrect</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {percentage}%
                </div>
                <div className="text-gray-600 text-sm">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-6">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                    currentUserAnswer && currentUserAnswer.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    Question {currentQuestionIndex + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        currentQuestion.difficulty === "Easy"
                          ? "bg-green-100 text-green-700"
                          : currentQuestion.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                    {currentUserAnswer.isCorrect ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Correct
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                        Incorrect
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {currentUserAnswer.isCorrect ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const status = getAnswerStatus(index, currentQuestionIndex);
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-2 ${getStatusStyles(status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            status === "correct-selected" ||
                            status === "correct"
                              ? "bg-green-400 text-white"
                              : status === "incorrect-selected"
                                ? "bg-red-400 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                      {getStatusIcon(status)}
                    </div>
                    {status === "incorrect-selected" && (
                      <div className="mt-2 text-sm text-red-600">
                        Your answer
                      </div>
                    )}
                    {status === "correct" &&
                      index !== currentUserAnswer.selectedAnswer && (
                        <div className="mt-2 text-sm text-green-600">
                          Correct answer
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Explanation</h3>
              </div>
              <p className="text-blue-700 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 rounded-2xl border-purple-300 text-purple-600 bg-transparent"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAllQuestions(true)}
                className="px-6 py-3 rounded-2xl border-blue-300 text-blue-600 bg-transparent"
              >
                View All Questions
              </Button>
            </div>

            <Button
              onClick={() =>
                setCurrentQuestionIndex(
                  Math.min(totalQuestions - 1, currentQuestionIndex + 1)
                )
              }
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Question Navigation Grid */}
          <div className="bg-white rounded-2xl p-4 shadow-xl mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {sampleQuestions.map((_, index) => {
                const userAnswer = sampleUserAnswers[index];
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                        : userAnswer.isCorrect
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-red-100 text-red-700 border-2 border-red-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl"
              onClick={() => (window.location.href = `/quiz/${id}`)}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 px-8 py-3 rounded-2xl bg-transparent"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
