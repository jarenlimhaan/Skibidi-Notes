'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar2";

export default function Home() {

  const handleFeedClick = () => {
    console.log("Feeding brain rot...")
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: "#F5ECD5"}}>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
           
              <div className="flex flex-col justify-center items-center text-center space-y-4">
                <div className="flex items-center justify-center">
                <Image
                  src="/pig.jpg"
                  alt="Hero Image"
                  width={550}
                  height={550}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
                <div className="space-y-2 max-w-[600px]">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Born to Be An Academic Weapon
                  </h1>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Link href="/create">
                    <Button size="lg" onClick={handleFeedClick}>
                      Feed The Brain Rot Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button> 
                  </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-[900px] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform makes learning fun and easy through generating concise notes
                  and questions to test your knowledge!
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {[
                {
                  num: "1",
                  title: "Upload & Summarise",
                  desc: "Upload your PDF, PPTX or JPEG lecture slides and our AI will create concise summaries",
                },
                {
                  num: "2",
                  title: "Choose Your Background",
                  desc: "Select backgrounds from popular games like Minecraft, Temple Run or Subway Surfers",
                },
                {
                  num: "3",
                  title: "Test Your Knowledge",
                  desc: "Reinforce learning with Kahoot-style quizzes specially generated from your content.",
                },
              ].map(({ num, title, desc }) => (
                <div
                  key={num}
                  className="flex flex-col items-center space-y-4 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl font-bold text-primary">
                      {num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-[900px] mx-auto">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Key Features
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers everything you need to bring your creative
                  vision to life.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              {[
                {
                  title: "Intuitive Creation Tools",
                  desc: "Easy-to-use tools that help you create professional-quality content without any technical skills.",
                },
                {
                  title: "Extensive Library",
                  desc: "Access thousands of templates, assets, and resources to enhance your creations.",
                },
                {
                  title: "Community Collaboration",
                  desc: "Connect with other creators, collaborate on projects, and share feedback.",
                },
                {
                  title: "Analytics & Insights",
                  desc: "Track the performance of your content and gain valuable insights to improve your creations.",
                },
              ].map(({ title, desc }, idx) => (
                <div key={idx} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">{title}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white max-w-[900px] mx-auto">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators who are already using our platform
                  to bring their ideas to life.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                <Button size="lg" variant="secondary">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="secondary">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-gray-100 py-6 dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 Your Company. All rights reserved.
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-sm text-gray-500 hover:underline dark:text-gray-400"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:underline dark:text-gray-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 hover:underline dark:text-gray-400"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
