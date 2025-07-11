"use client"

import { useState, useEffect } from "react"
import { Clock, Trophy, ArrowLeft, ArrowRight, Flag, Volume2, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar";

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface QuizState {
  currentQuestion: number
  answers: (number | null)[]
  timeRemaining: number
  isPlaying: boolean
  showExplanation: boolean
  quizCompleted: boolean
  score: number
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France, known for landmarks like the Eiffel Tower.",
    difficulty: "Easy",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    explanation:
      "Mars is called the Red Planet due to iron oxide (rust) on its surface giving it a reddish appearance.",
    difficulty: "Medium",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
    explanation:
      "The Blue Whale is the largest animal ever known to have lived on Earth, reaching lengths up to 100 feet.",
    difficulty: "Medium",
  },
  {
    id: 4,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    explanation: "World War II ended in 1945 with the surrender of Japan following the atomic bombings.",
    difficulty: "Hard",
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    explanation: "Au comes from the Latin word 'aurum' meaning gold. Ag (from 'argentum') is silver.",
    difficulty: "Medium",
  },
]

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: new Array(sampleQuestions.length).fill(null),
    timeRemaining: 900, // 15 minutes
    isPlaying: true,
    showExplanation: false,
    quizCompleted: false,
    score: 0,
  })

  // Timer effect
  useEffect(() => {
    if (quizState.isPlaying && quizState.timeRemaining > 0 && !quizState.quizCompleted) {
      const timer = setTimeout(() => {
        setQuizState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (quizState.timeRemaining === 0) {
      handleQuizComplete()
    }
  }, [quizState.timeRemaining, quizState.isPlaying, quizState.quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (quizState.showExplanation) return

    const newAnswers = [...quizState.answers]
    newAnswers[quizState.currentQuestion] = answerIndex
    setQuizState((prev) => ({
      ...prev,
      answers: newAnswers,
    }))
  }

  const handleNextQuestion = () => {
    if (quizState.showExplanation) {
      setQuizState((prev) => ({
        ...prev,
        showExplanation: false,
      }))
    }

    if (quizState.currentQuestion < sampleQuestions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }))
    } else {
      handleQuizComplete()
    }
  }

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        showExplanation: false,
      }))
    }
  }

  const handleShowExplanation = () => {
    setQuizState((prev) => ({
      ...prev,
      showExplanation: true,
    }))
  }

  const handleQuizComplete = () => {
    const score: number = quizState.answers.reduce((total: number, answer: number | null, index: number) => {
        const correct = sampleQuestions[index]?.correctAnswer
        return answer !== null && answer === correct ? total + 1 : total
    }, 0)

    setQuizState((prev) => ({
        ...prev,
        quizCompleted: true,
        score,
        isPlaying: false,
    }))
    }

  const toggleTimer = () => {
    setQuizState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }))
  }

  const currentQ = sampleQuestions[quizState.currentQuestion]
  const progress = ((quizState.currentQuestion + 1) / sampleQuestions.length) * 100
  const selectedAnswer = quizState.answers[quizState.currentQuestion]

  if (quizState.quizCompleted) {
    const percentage = Math.round((quizState.score / sampleQuestions.length) * 100)
    return (
      <>
      <Navbar/>
      
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
                <div className="text-6xl font-bold text-purple-600 mb-2">{percentage}%</div>
                <p className="text-xl text-gray-600 mb-6">
                You scored {quizState.score} out of {sampleQuestions.length} questions correctly
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-purple-50 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-purple-600">{quizState.score}</div>
                    <div className="text-gray-600">Correct</div>
                </div>
                <div className="bg-pink-50 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-pink-600">{sampleQuestions.length - quizState.score}</div>
                    <div className="text-gray-600">Incorrect</div>
                </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl">
                    Try Again
                </Button>
                <Button
                    variant="outline"
                    className="border-purple-300 text-purple-600 px-8 py-3 rounded-2xl bg-transparent"
                >
                    Review Answers
                </Button>
                </div>
            </div>
            </div>
        </div>
      </>
    )
  }

  return (
    <>
        <Navbar/>
        
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300">
        {/* Background Video Placeholder */}
        <div className="fixed inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center">
            <div className="text-purple-300 text-6xl font-bold opacity-10">MINECRAFT</div>
            </div>
        </div>

        {/* Quiz Interface */}
        <div className="relative z-10 p-6">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="icon" className="rounded-xl bg-transparent border-purple-300">
                    <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                    <div className="font-semibold text-gray-800">General Knowledge Quiz</div>
                    <div className="text-sm text-gray-600">
                        Question {quizState.currentQuestion + 1} of {sampleQuestions.length}
                    </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-purple-50 rounded-xl px-3 py-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="font-mono font-semibold text-purple-600">{formatTime(quizState.timeRemaining)}</span>
                    <Button variant="ghost" size="icon" onClick={toggleTimer} className="w-6 h-6">
                        {quizState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl bg-transparent border-purple-300">
                    <Volume2 className="w-5 h-5" />
                    </Button>
                </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    ></div>
                </div>
                </div>
            </div>
            </div>

            {/* Question Card */}
            <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {quizState.currentQuestion + 1}
                    </div>
                    <div>
                    <div className="font-semibold text-gray-800">Question {quizState.currentQuestion + 1}</div>
                    <div
                        className={`text-sm px-2 py-1 rounded-full ${
                        currentQ.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : currentQ.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                        {currentQ.difficulty}
                    </div>
                    </div>
                </div>
                <Button variant="outline" size="icon" className="rounded-xl bg-transparent border-purple-300">
                    <Flag className="w-5 h-5" />
                </Button>
                </div>

                {/* Question */}
                <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">{currentQ.question}</h2>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQ.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === currentQ.correctAnswer
                    const showResult = quizState.showExplanation

                    return (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={quizState.showExplanation}
                        className={`p-4 rounded-2xl text-left transition-all duration-200 border-2 ${
                        showResult
                            ? isCorrect
                            ? "bg-green-50 border-green-400 text-green-800"
                            : isSelected
                                ? "bg-red-50 border-red-400 text-red-800"
                                : "bg-gray-50 border-gray-200 text-gray-600"
                            : isSelected
                            ? "bg-purple-50 border-purple-400 text-purple-800 shadow-lg transform scale-105"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-purple-25 hover:border-purple-300"
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            showResult
                                ? isCorrect
                                ? "bg-green-400 text-white"
                                : isSelected
                                    ? "bg-red-400 text-white"
                                    : "bg-gray-300 text-gray-600"
                                : isSelected
                                ? "bg-purple-400 text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                        >
                            {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                        </div>
                    </button>
                    )
                })}
                </div>

                {/* Explanation */}
                {quizState.showExplanation && (
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Explanation</h3>
                    <p className="text-blue-700">{currentQ.explanation}</p>
                </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={quizState.currentQuestion === 0}
                    className="px-6 py-3 rounded-2xl border-purple-300 text-purple-600 bg-transparent"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                </Button>

                <div className="flex space-x-3">
                    {selectedAnswer !== null && !quizState.showExplanation && (
                    <Button
                        variant="outline"
                        onClick={handleShowExplanation}
                        className="px-6 py-3 rounded-2xl border-blue-300 text-blue-600 bg-transparent"
                    >
                        Show Explanation
                    </Button>
                    )}

                    <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null && !quizState.showExplanation}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl"
                    >
                    {quizState.currentQuestion === sampleQuestions.length - 1 ? "Finish Quiz" : "Next"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
                </div>
            </div>
            </div>

            {/* Question Navigation */}
            <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl">
                <div className="flex flex-wrap gap-2 justify-center">
                {sampleQuestions.map((_, index) => (
                    <button
                    key={index}
                    onClick={() => setQuizState((prev) => ({ ...prev, currentQuestion: index, showExplanation: false }))}
                    className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                        index === quizState.currentQuestion
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                        : quizState.answers[index] !== null
                            ? "bg-green-100 text-green-700 border-2 border-green-300"
                            : "bg-gray-100 text-gray-600 hover:bg-purple-50"
                    }`}
                    >
                    {index + 1}
                    </button>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
  )
}
