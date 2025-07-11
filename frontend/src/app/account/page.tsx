"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { useState } from "react";

import Navbar from "@/components/navbar";

import { useAuthStore } from "../store/authStore";
import { useUpdateUser } from "../providers/queries/users";

export default function AccountPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const user = useAuthStore((state) => state?.user);

  const { mutate } = useUpdateUser(user?.user_id ?? "");
  const [form, setForm] = useState({
    username: user?.user_id,
    email: user?.email,
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(passwordForm);
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
    });
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 p-8">

    {/* Header */}
  <header className="backdrop-blur-sm rounded-md mt-4">
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="flex items-center justify-start space-x-3">
        <Settings className="h-8 w-8 text-white" />
        <h1 className="text-3xl font-bold text-white tracking-wider">
          Skibidi Toilet Control Pannel
        </h1>
      </div>
    </div>
  </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-purple-900/40 border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-6">
                  <Avatar className="w-32 h-32 border-4 border-gradient-to-r from-pink-400 to-cyan-400">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white text-3xl">
                      BR
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white shadow-lg"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                <CardTitle className="text-2xl text-white font-bold">
                  {user?.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="text-sm text-purple-200 uppercase tracking-wider">
                    Account Status
                  </div>
                  <Badge className="bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-green-300 border border-green-400/30 px-4 py-2">
                    ✨ Loser ✨
                  </Badge>
                </div>
                <Separator className="bg-purple-400/20" />
                <div className="space-y-4 text-base">
                  <div className="flex justify-between text-purple-200">
                    <span>Videos Created</span>
                    <span className="text-cyan-300 font-bold">127</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="bg-purple-900/40 border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3 font-bold">
                  <User className="h-6 w-6 text-cyan-400" />
                  Your Alien Identity
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Update Personal Flush Facts & Brainrot Vibes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} method="PUT">
                  <div className="space-y-3">
                    <Label
                      htmlFor="username"
                      className="text-white text-lg font-medium"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      defaultValue={user?.username}
                      className="h-14 bg-transparent border-2 border-purple-400/50 text-white placeholder:text-purple-200/70 text-lg rounded-lg focus:border-cyan-400 focus:ring-cyan-400/20"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-white text-lg font-medium"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        defaultValue={user?.email}
                        className="h-14 pl-12 bg-transparent border-2 border-purple-400/50 text-white placeholder:text-purple-200/70 text-lg rounded-lg focus:border-cyan-400 focus:ring-cyan-400/20"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <br></br>

                  <Button className="w-full h-14 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold text-lg rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200">
                    <Save className="h-5 w-5 mr-2" type="submit" />
                    Flush To Save
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-purple-900/40 border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-3 font-bold">
                  <Lock className="h-6 w-6 text-pink-400" />
                  Poop Protection & Passcode
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  Shield Your Skibidi Brainrot Empire From Poop Pirates
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmitPassword}>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="current-password"
                      className="text-white text-lg font-medium"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        name="oldPassword"
                        onChange={handlePasswordChange}
                        value={passwordForm.oldPassword}
                        placeholder="Enter current password"
                        className="h-14 pl-12 pr-12 bg-transparent border-2 border-purple-400/50 text-white placeholder:text-purple-200/70 text-lg rounded-lg focus:border-pink-400 focus:ring-pink-400/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 text-purple-300 hover:bg-purple-800/20"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="new-password"
                      className="text-white text-lg font-medium"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-300" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        onChange={handlePasswordChange}
                        value={passwordForm.newPassword}
                        placeholder="Enter new password"
                        className="h-14 pl-12 pr-12 bg-transparent border-2 border-purple-400/50 text-white placeholder:text-purple-200/70 text-lg rounded-lg focus:border-pink-400 focus:ring-pink-400/20"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 text-cyan-300 hover:bg-cyan-800/20"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1 h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold text-lg rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200">
                      <Lock className="h-5 w-5 mr-2" type="submit" />
                      Change Flushcode
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
    </>
  );
}
