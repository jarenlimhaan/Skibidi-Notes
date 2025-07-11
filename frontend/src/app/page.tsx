"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar";

const steps = [
  {
    number: 1,
    title: "Upload & Summarise",
    description: "Upload your PDF, PPTX or JPEG lecture slides and our AI will create concise summaries",
    icon: <Upload className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    image: "/placeholder.svg?height=200&width=300&text=Upload+Files",
  },
  {
    number: 2,
    title: "Choose Your Background",
    description: "Select backgrounds from popular games like Minecraft, Temple Run or Subway Surfers",
    icon: <Gamepad2 className="w-8 h-8" />,
    color: "from-pink-500 to-purple-500",
    image: "/placeholder.svg?height=200&width=300&text=Game+Backgrounds",
  },
  {
    number: 3,
    title: "Test Your Knowledge",
    description: "Reinforce learning with Kahoot-style quizzes specially generated from your content",
    icon: <Brain className="w-8 h-8" />,
    color: "from-purple-600 to-pink-400",
    image: "/placeholder.svg?height=200&width=300&text=Interactive+Quiz",
  },
]

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
      "I am a dumbass so this is a good app for me to improve my grades from F to A",
    rating: 5,
    avatar: "/yanshuen_pic.png?height=60&width=60&text=MC",
  },
  {
    name: "Jaren Lim Haan",
    role: "University Student",
    content:
      "I love brain rotting coochiemeowmeow",
    rating: 5,
    avatar: "/jaren_pic.png?height=60&width=60&text=ED",
  },
]

const stats = [
  { number: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
  { number: "1M+", label: "Quizzes Created", icon: <Brain className="w-6 h-6" /> },
  { number: "95%", label: "Success Rate", icon: <Trophy className="w-6 h-6" /> },
  { number: "24/7", label: "Support", icon: <Clock className="w-6 h-6" /> },
]

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
    <Navbar/>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
                Make Learning
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Fun</span>{" "}
                &
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Interactive
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Transform your study materials into engaging quizzes with AI-powered summaries and gaming backgrounds.
                Learn faster, remember longer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Start Creating Quizzes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-600 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-purple-50 bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <img
                  src="/placeholder.svg?height=400&width=500&text=Quiz+Platform+Demo"
                  alt="Quiz Platform Demo"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create engaging, effective learning experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Summaries</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI creates concise, accurate summaries from your content, saving you hours of manual work.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Customizable Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose from various themes and backgrounds to match your style and keep learners engaged.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Engaging Quizzes</h3>
              <p className="text-gray-600 leading-relaxed">
                Interactive quizzes that make learning fun and memorable with instant feedback and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our platform makes learning fun and easy through generating concise notes and questions to test your
              knowledge!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-32 left-full w-8 h-1 bg-gradient-to-r from-purple-300 to-pink-300 z-10 transform translate-x-4"></div>
                )}

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${step.color} opacity-20`}></div>
                    <div className="absolute top-4 left-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-lg font-bold text-white">{step.number}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${step.color} bg-opacity-20 rounded-2xl flex items-center justify-center mb-6`}
                    >
                      <div className="text-purple-600">{step.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied learners and educators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-purple-100 mb-8">
              Join thousands of students and educators who are already creating amazing quizzes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-gray-100 shadow-lg">
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white hover:text-purple-600 bg-transparent"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SkibidiNotes</span>
              </div>
              <p className="text-gray-400">Making learning fun and interactive with AI-powered quizzes.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Skibidi Notes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
