"use client"

import React, { useState } from "react"
import { useRegisterUser } from "@/app/providers/queries/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const router = useRouter()
  const { mutate: registerUser } = useRegisterUser()
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [message, setMessage] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    const { username, email, password, confirmPassword } = formData

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    registerUser(
      { username, email, password },
      {
        onSuccess: () => {
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          router.push("/login")
        },
        onError: (error: any) => {
          setMessage(error.response?.data?.detail || "Registration failed.")
        },
      }
    )
  }

  return (
    <div
      className="flex h-screen w-screen font-mono bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900"
      style={{ fontFamily: "JetBrainMono" }}
    >
      {/* Left Side - Image */}
      <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-sm relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 w-3/4 h-3/4 flex items-center justify-center">
          <img
            src="/tungtungtungtung.png"
            alt="Vaporwave Image"
            className="max-w-full max-h-full object-contain drop-shadow-2xl filter brightness-110 contrast-110 saturate-150"
            style={{
              filter:
                "drop-shadow(0 0 30px #ff00ff80) drop-shadow(0 0 60px #00ffff40) brightness(1.2) contrast(1.1) saturate(1.3)",
            }}
          />
        </div>

        {/* Grid overlay for vaporwave effect */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,0,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,0,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-yellow-400/20 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <Card className="bg-black/40 backdrop-blur-md border-2 border-pink-400/50 shadow-2xl shadow-pink-500/25">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                CREATE AN ACCOUNT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-purple-900/50 border-2 border-pink-400/50 text-white placeholder:text-pink-200/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 h-12 text-lg"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-purple-900/50 border-2 border-pink-400/50 text-white placeholder:text-pink-200/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 h-12 text-lg"
                />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="bg-purple-900/50 border-2 border-pink-400/50 text-white placeholder:text-pink-200/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 h-12 text-lg"
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="bg-purple-900/50 border-2 border-pink-400/50 text-white placeholder:text-pink-200/70 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 h-12 text-lg"
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 border-0 shadow-lg shadow-pink-500/50 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="drop-shadow-lg">Sign Up</span>
                </Button>
              </form>

              <div className="text-center space-y-4 pt-4">
                {message && (
                  <p className="text-yellow-300 font-semibold text-lg drop-shadow-lg animate-pulse">
                    {message}
                  </p>
                )}
                <p className="text-pink-200 text-lg">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-cyan-300 hover:text-yellow-300 underline font-bold transition-colors duration-300 drop-shadow-lg"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
