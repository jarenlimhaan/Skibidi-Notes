"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Settings, Play, Search, FileText, X } from "lucide-react"

export default function BrainRotCustomizer() {
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedBackground, setSelectedBackground] = useState<string>("")
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const backgroundVideos = [
    { id: "minecraft", name: "Minecraft", image: "/placeholder.svg?height=120&width=160" },
    { id: "subway", name: "Subway Surfers", image: "/placeholder.svg?height=120&width=160" },
    { id: "temple", name: "Temple Run", image: "/placeholder.svg?height=120&width=160" },
    { id: "gta", name: "GTA", image: "/placeholder.svg?height=120&width=160" },
  ]

  const voiceOptions = [
    { id: "siri1", name: "Apple Siri", accent: "American", gender: "Male", personality: "Friendly" },
    { id: "siri2", name: "Apple Siri", accent: "British", gender: "Female", personality: "Professional" },
    { id: "siri3", name: "Google Assistant", accent: "American", gender: "Female", personality: "Casual" },
  ]

  const filteredVoices = voiceOptions.filter(
    (voice) =>
      voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voice.gender.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) =>
          file.type === "application/pdf" ||
          file.type === "application/vnd.ms-powerpoint" ||
          file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
          file.type.startsWith("image/jpeg"),
      )
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">Brain Rot Creator</h1>
          <p className="text-purple-600 text-sm">
            Create engaging content by uploading your documents and customizing the output.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-lg p-1 shadow-sm max-w-md mx-auto h-auto">
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=inactive]:text-purple-400 hover:text-purple-600 rounded-md transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="customise"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=inactive]:text-purple-400 hover:text-purple-600 rounded-md transition-all"
            >
              <Settings className="w-4 h-4" />
              Customise
            </TabsTrigger>
            <TabsTrigger
              value="process"
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=inactive]:text-purple-400 hover:text-purple-600 rounded-md transition-all"
            >
              <Play className="w-4 h-4" />
              Process
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Upload Your Document</h2>
              <p className="text-purple-600 text-sm">
                Upload your lecture slides or notes. We support PDF, PPTX and JPEG formats.
              </p>
            </div>

            <Card className="bg-white p-6 border-2 border-purple-300">
              <div
                className={`bg-white border-2 border-dashed border-purple-300 rounded-lg p-12 text-center transition-colors ${
                  isDragOver ? "bg-purple-100" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-700 text-lg mb-6">Drag and drop to dump</p>

                <div className="flex justify-between items-center">
                  <Button
                    variant="secondary"
                    onClick={() => setUploadedFiles([])}
                    className="bg-pink-300 hover:bg-pink-400 text-white"
                  >
                    Cancel
                  </Button>

                  <div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.pptx,.ppt,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white">Upload</Button>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-white p-6 border-2 border-purple-300">
                <h3 className="text-lg font-semibold mb-4 text-purple-700">Uploaded Files ({uploadedFiles.length})</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="font-medium text-sm text-purple-800">{file.name}</p>
                          <p className="text-xs text-purple-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="text-pink-500 hover:text-pink-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Customise Tab */}
          <TabsContent value="customise" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Customise Your Brain Rot</h2>
              <p className="text-purple-600 text-sm">
                Choose the background, voice type and quiz length to customise your own brain rot.
              </p>
            </div>

            {/* Background Video Selection */}
            <Card className="bg-white p-6 border-2 border-purple-300">
              <h3 className="text-purple-700 text-lg font-medium mb-4">Select your background video</h3>

              <div className="p-4 rounded">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {backgroundVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`cursor-pointer transition-all rounded ${
                        selectedBackground === video.id ? "ring-2 ring-pink-500" : ""
                      }`}
                      onClick={() => setSelectedBackground(video.id)}
                    >
                      <div className="relative">
                        <img
                          src={video.image || "/placeholder.svg"}
                          alt={video.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-purple-700 bg-opacity-50 text-white text-xs p-1 rounded-b">
                          {video.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Voice Type Selection */}
            <Card className="bg-white p-6 border-2 border-purple-300">
              <h3 className="text-purple-700 text-lg font-medium mb-4">Select your voice type</h3>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-purple-50 pl-10 text-purple-800"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
              </div>

              {/* Voice Options */}
              <div className="space-y-3">
                {filteredVoices.map((voice) => (
                  <Card
                    key={voice.id}
                    className={`bg-purple-50 p-4 cursor-pointer transition-all hover:bg-purple-100 ${
                      selectedVoice === voice.id ? "ring-2 ring-pink-500" : ""
                    }`}
                    onClick={() => setSelectedVoice(voice.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="ghost" className="p-2 text-purple-500">
                          <Play className="w-4 h-4" />
                        </Button>
                        <span className="font-medium text-purple-800">{voice.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-purple-200 rounded text-xs text-purple-800">{voice.accent}</span>
                        <span className="px-2 py-1 bg-purple-200 rounded text-xs text-purple-800">{voice.gender}</span>
                        <span className="px-2 py-1 bg-purple-200 rounded text-xs text-purple-800">{voice.personality}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  )
}
