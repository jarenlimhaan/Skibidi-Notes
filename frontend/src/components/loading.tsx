"use client"

import Navbar from "./navbar"
import { useEffect, useState } from "react"

export default function ToiletAnimation2() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return oldProgress + 1
      })
    }, 150) // Adjust speed here (slower: 150ms per increment)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 space-y-4">
        <img
          src="/toilet_flushing.gif"
          alt="Toilet Animation"
          className="w-48 h-48 object-contain"
        />
        <p className="text-lg text-gray-700 text-center">
          Brewing the ultimate Skibidi potion…
        </p>

        <div className="w-64 bg-gray-300 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-200 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  )
}
