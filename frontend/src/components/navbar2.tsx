"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/app/store/authStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="w-full border-b bg-gradient-to-r from-purple-800 via-pink-500 to-cyan-400 z-50">
      <div className="w-full flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Logo</span>
        </Link>
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white transition-colors hover:text-purple-200"
          >
            Home
          </Link>
          <Link
            href="/create"
            className="text-sm font-medium text-white transition-colors hover:text-purple-200"
          >
            Create
          </Link>
          <Link
            href="/library"
            className="text-sm font-medium text-white transition-colors hover:text-purple-200"
          >
            Library
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-white transition-colors hover:text-purple-200"          
          >
            Chat
          </Link>
          <Link
            href="/account"
            className="text-sm font-medium text-white transition-colors hover:text-purple-200"
          >
            My Account
          </Link>
        </nav>
        <div className="ml-auto md:ml-4 flex items-center gap-4">
          <div className="hidden md:flex gap-2">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            ) : (
              <Button variant="destructive" size="sm" onClick={logout}>
                Logout
              </Button>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 text-white" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-gradient-to-r from-purple-800 via-pink-500 to-cyan-400"
            >
              <div className="flex flex-col gap-6 pt-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-white transition-colors hover:text-purple-200"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/create"
                  className="text-sm font-medium text-white transition-colors hover:text-purple-200"
                  onClick={() => setIsOpen(false)}
                >
                  Create
                </Link>
                <Link
                  href="/library"
                  className="text-sm font-medium text-white transition-colors hover:text-purple-200"
                  onClick={() => setIsOpen(false)}
                >
                  Library
                </Link>
                <div className="flex flex-col gap-2">
                  {!isAuthenticated ? (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Register</Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
