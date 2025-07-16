"use client";

import { useState } from "react";
import {
  Upload,
  Gamepad2,
  Brain,
  FileText,
  Settings,
  Trophy,
  Play,
  Star,
  Users,
  Clock,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar2";
import Link from "next/link";

import { useAuthStore } from "./store/authStore";

const steps = [
  {
    number: 1,
    title: "Upload & Summarise",
    description:
      "Upload your PDF, PPTX or JPEG lecture slides and our AI will create concise summaries",
    icon: <Upload className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    image: "/upload_and_summarise.png?height=200&width=300&text=Upload+Files",
  },
  {
    number: 2,
    title: "Choose Your Background",
    description:
      "Select backgrounds from popular games like Minecraft, Temple Run or Subway Surfers",
    icon: <Gamepad2 className="w-8 h-8" />,
    color: "from-pink-500 to-purple-500",
    image: "/choose_background.png?height=200&width=300&text=Game+Backgrounds",
  },
  {
    number: 3,
    title: "Test Your Knowledge",
    description:
      "Reinforce learning with Kahoot-style quizzes specially generated from your content",
    icon: <Brain className="w-8 h-8" />,
    color: "from-purple-600 to-pink-400",
    image: "/quiz_time.png?height=200&width=300&text=Interactive+Quiz",
  },
];

const testimonials = [
  {
    name: "Ada Chia",
    role: "University Student",
    content:
      "I watch alot of TikTok and YouTube reels. Skibidi Notes makes studying feel like watching a TikTok video which keeps me entertained while learning. 10/10 would recommend!",
    rating: 5,
    avatar: "/ada_pic.png?height=60&width=60&text=SJ",
  },
  {
    name: "Yan Shuen",
    role: "High School Student",
    content:
      "Skibidi Notes is a game changer! I can now turn my boring lecture notes into fun quizzes that actually help me remember things better. Plus, the backgrounds are so cool! Highly recommended!",
    rating: 5,
    avatar: "/yanshuen_pic.png?height=60&width=60&text=MC",
  },
  {
    name: "Jaren Lim Haan",
    role: "University Student",
    content: "Before Skibidi Notes, my brain was a soggy tissue. Now, it is a full toilet roll of knowledge! I can finally bop bop yes yes through my exams without crying like a potato in the shower.",
    rating: 5,
    avatar: "/jaren_pic.png?height=60&width=60&text=ED",
  },
];

const stats = [
  { number: "4", label: "Active Users", icon: <Users className="w-6 h-6" /> },
  {
    number: "2",
    label: "Quizzes Created",
    icon: <Brain className="w-6 h-6" />,
  },
  {
    number: "100%",
    label: "Success Rate",
    icon: <Trophy className="w-6 h-6" />,
  },
  { number: "24/7", label: "0 Support", icon: <Clock className="w-6 h-6" /> },
];

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 font-mono">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Make Learning A Skibidi Bop Party
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-6 leading-relaxed">
                  Transform your study materials into engaging quizzes with
                  AI-powered summaries and gaming backgrounds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={isAuthenticated ? "/create" :"/register"}>
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      Brainrot Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-2 border-purple-300 text-purple-600 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-purple-50"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="relative">
                <video
                  src="/homepage_video.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-80 object-cover rounded-2xl"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-10 px-6">
            <div className="max-w-7xl mx-auto bg-white rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to create engaging, effective learning
                experiences
              </p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Summaries",
                  desc: "Advanced AI creates concise, accurate summaries from your content, saving you hours of manual work.",
                  icon: <FileText className="w-8 h-8 text-white" />,
                  bg: "from-purple-500 to-pink-500",
                },
                {
                  title: "Customizable Experience",
                  desc: "Choose from various backgrounds and voices to match your style and keep learners engaged.",
                  icon: <Settings className="w-8 h-8 text-white" />,
                  bg: "from-pink-500 to-purple-500",
                },
                {
                  title: "Engaging Quizzes",
                  desc: "Interactive quizzes that make learning fun and memorable with instant feedback and progress tracking.",
                  icon: <Trophy className="w-8 h-8 text-white" />,
                  bg: "from-purple-600 to-pink-400",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our platform makes learning fun and easy through generating
                concise notes and questions to test your knowledge!
              </p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 bg-opacity-20 rounded-2xl flex items-center justify-center mb-6">
                      <div className="text-purple-600">{step.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-12 px-6">
            <div className="max-w-7xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Toilet Talks: User Reviews
              </h2>
              <p className="text-xl text-gray-600">
                Join The Brainrotted Rizzlers
              </p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Roll Into Brainrot Brilliance?
                </h2>
                <p className="text-xl text-purple-100 mb-8">
                  I am no longer cooked. I will do the cooking. Join the Skibidi
                  Notes revolution and transform your study sessions into a fun,
                  interactive experience.
                </p>
                <div className="flex justify-center">
                  <Link href={isAuthenticated ? "/create" :"/register"}>
                    <Button className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-gray-100 shadow-lg">
                      Start Cookin'
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 text-center mt-auto">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SkibidiNotes</span>
            </div>
            <p className="text-gray-400 max-w-xl">
              Making learning fun and interactive with AI-powered quizzes.
            </p>
            <div className="border-t border-gray-800 w-full max-w-xs mt-6 pt-4 text-gray-400 text-sm">
              <p>&copy; 2025 Skibidi Notes. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
