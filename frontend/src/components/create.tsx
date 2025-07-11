"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Settings, Play, Search, FileText, Mic, HelpCircle, Video} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation"

interface UploadedFile {
  file: File;
  name: string;
  size: string;
  type: string;
}

export default function BrainRotCustomizer() {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedBackground, setSelectedBackground] = useState<string>("");
  const [selectedBackgroundName, setSelectedBackgroundName] =
    useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [customInput, setCustomInput] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  const isFormComplete = selectedBackground && selectedVoice && questionCount > 0

  // need to upload the rest
  const backgroundVideos = [
    {
      id: "minecraft",
      name: "Minecraft",
      image: "/minecraft_gameplay.png?height=120&width=160",
    },
    {
      id: "subway.mp4",
      name: "Subway Surfers",
      image: "/subway_gameplay.png?height=120&width=160",
    },
    {
      id: "temple",
      name: "Temple Run",
      image: "/temple_gameplay.png?height=120&width=160",
    },
    { id: "gta", name: "GTA", image: "/gta_gameplay.png?height=120&width=160" },
  ];

  const voiceOptions = [
    {
      id: "e02TCHG9lAYD9pABEDcr",
      name: "Kai Cenat",
      accent: "American",
      gender: "Male",
      personality: "Streamer",
    },
    {
      id: "Ra3cjI6YRmJZOaBdFjTP",
      name: "IshowSpeed",
      accent: "American",
      gender: "Male",
      personality: "Streamer",
    },
    {
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Sarah",
      accent: "American",
      gender: "Female",
      personality: "Casual",
    },
  ];

  const filteredVoices = voiceOptions.filter(
    (voice) =>
      voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voice.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/jpg",
    ];
    return validTypes.includes(file.type);
  };

  const handleFiles = useCallback(
    async (files: FileList) => {
      setIsUploading(true);
      const validFiles: UploadedFile[] = [];

      // Only allow up to 2 files in total (including already uploaded)
      const maxFiles = 2;
      const alreadyUploaded = uploadedFiles.length;
      const filesToAdd = Math.max(0, maxFiles - alreadyUploaded);

      if (alreadyUploaded >= maxFiles) {
        alert("You can only upload up to 2 files.");
        setIsUploading(false);
        return;
      }

      for (let i = 0; i < files.length && validFiles.length < filesToAdd; i++) {
        const file = files[i];
        if (isValidFileType(file)) {
          validFiles.push({
            file,
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
          });
        }
      }

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUploadedFiles((prev) => [...prev, ...validFiles]);
      setIsUploading(false);
    },
    [uploadedFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles]
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const presetOptions = [
    {
      count: 5,
      label: "Quick",
      description: "Perfect for a short review",
      difficulty: "Easy",
    },
    {
      count: 10,
      label: "Standard",
      description: "Good balance of coverage",
      difficulty: "Medium",
    },
    {
      count: 15,
      label: "Comprehensive",
      description: "Thorough understanding check",
      difficulty: "Hard",
    },
  ];

  const handlePresetSelect = (count: number) => {
    setQuestionCount(count);
    setIsCustomMode(false);
    setCustomInput("");
  };

  const handleCustomInput = (value: string) => {
    const num = Number.parseInt(value);
    if (!isNaN(num) && num > 0 && num <= 15) {
      setQuestionCount(num);
      setCustomInput(value);
    } else if (value === "") {
      setCustomInput("");
    }
  };

  const incrementCount = () => {
    if (questionCount < 15) {
      const newCount = questionCount + 1;
      setQuestionCount(newCount);
      if (isCustomMode) setCustomInput(newCount.toString());
    }
  };

  const decrementCount = () => {
    if (questionCount > 1) {
      const newCount = questionCount - 1;
      setQuestionCount(newCount);
      if (isCustomMode) setCustomInput(newCount.toString());
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstimatedTime = (count: number) => {
    const minutes = Math.ceil(count * 0.5); // Assuming 0.5 minutes per question
    return `~${minutes} min`;
  };

  return (
    <>
      <Navbar />

        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 font-mono">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-purple-700 mb-6">
                Brain Rot Creator
              </h1>
              <p className="text-purple-600 text-sm">
                Create engaging content by uploading your documents and
                customizing the output.
              </p>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-lg p-1 shadow-sm max-w-md mx-auto h-auto"> */}
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-xl p-1.5 border border-purple-300 max-w-md mx-auto h-auto">
                <TabsTrigger
                  value="upload"
                  // className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=inactive]:text-purple-400 hover:text-purple-600 rounded-md transition-all"
                className={`flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "upload"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-black hover:bg-purple-100"
                }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="customise"
                  // className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=inactive]:text-purple-400 hover:text-purple-600 rounded-md transition-all"
                  className={`flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === "customise"
                      ? "bg-purple-600 text-white"
                      : "bg-white text-black hover:bg-purple-100"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Customise
                </TabsTrigger>
                <TabsTrigger
                  value="process"
                  // className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=inactive]:text-purple-400 hover:text-purple-600 rounded-md transition-all"
                className={`flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === "process"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-black hover:bg-purple-100"
                }`}
                >
                <Play className="w-4 h-4" />
                Process
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">
                  Upload Your Document
                </h2>
                <p className="text-purple-600 text-sm">
                  Upload your lecture slides or notes. We support PDF, PPTX and
                  JPEG formats.
                </p>
              </div>

              <Card className="bg-white p-6 border-2 border-purple-300">
                {/* File Upload Area */}
                <label htmlFor="file-upload">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      isDragOver
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300 bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-lg text-gray-600 mb-4">
                        {isUploading
                          ? "Uploading..."
                          : "Drag and drop or click anywhere to dump"}
                      </p>
                      <Button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isUploading ? "Uploading..." : "Upload Files"}
                      </Button>
                    </div>
                  </div>
                </label>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Uploaded Files:
                    </h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-pink-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={uploadedFiles.length === 0}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
                    onClick={() => setActiveTab("customise")}
                  >
                    Submit Files ({uploadedFiles.length})
                  </Button>
                </div>

                {/* Hidden File Input Which Functions Click To Open The File Explorer */}
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.pptx,.ppt,.jpg,.jpeg"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </Card>
            </TabsContent>

            {/* Customise Tab */}
            <TabsContent value="customise" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">
                  Customise Your Brain Rot
                </h2>
                <p className="text-purple-600 text-sm">
                  Choose the background, voice type and quiz length to customise
                  your own brain rot.
                </p>
              </div>

              {/* Background Video Selection */}
              <Card className="bg-white p-6 border-2 border-purple-300">
                <h3 className="text-purple-700 text-lg font-medium mb-4">
                  Select your background video
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {backgroundVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => {
                          setSelectedBackground(video.id);
                          setSelectedBackgroundName(video.name);
                        }}
                      className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg ${
                        selectedBackground === video.id
                          ? "ring-3 ring-purple-500 shadow-lg"
                          : "ring-2 ring-transparent hover:ring-purple-200"
                      }`}
                    >
                      <img src={video.image || "/placeholder.svg"} alt={video.name} className="w-full h-32 object-cover" />
                      <div
                        className={`p-3 text-center font-medium text-white ${
                          selectedBackground === video.id ? "bg-purple-600" : "bg-purple-400"
                        }`}
                      >
                        {video.name}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Voice Type Selection */}
              <Card className="bg-white p-6 border-2 border-purple-300">
                <h3 className="text-purple-700 text-lg font-medium mb-4">
                  Select your voice type
                </h3>

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
                        selectedVoice === voice.id ? "border-purple-500 bg-purple-100" 
                                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedVoice(voice.id);
                        setSelectedVoiceName(voice.name);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 text-purple-500"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                          <span className="font-medium text-purple-800">
                            {voice.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-purple-200 rounded text-xs text-purple-800">
                            {voice.accent}
                          </span>
                          <span className="px-2 py-1 bg-purple-200 rounded text-xs text-purple-800">
                            {voice.gender}
                          </span>
                          <span className="px-2 py-1 bg-purple-200 rounded text-xs text-purple-800">
                            {voice.personality}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              <Card className="bg-white p-6 border-2 border-purple-300">
                <h3 className="text-purple-700 text-lg font-medium mb-4">
                  Select your quiz length
                </h3>

                <CardContent className="p-8">
                  {/* Current Selection Display */}
                  <div className="bg-purple-50 rounded-lg p-6 mb-6 text-center">
                    <div className="text-4xl font-bold text-purple-800 mb-2">
                      {questionCount}
                    </div>
                    <div className="text-purple-600 mb-2">
                      Questions Selected
                    </div>
                    <div className="text-sm text-purple-500">
                      Estimated time: {getEstimatedTime(questionCount)}
                    </div>
                  </div>

                  {/* Quick Adjust Controls */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decrementCount}
                      disabled={questionCount <= 1}
                      className="h-10 w-10 p-0 bg-transparent"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="15"
                        value={isCustomMode ? customInput : questionCount}
                        onChange={(e) => {
                          setIsCustomMode(true);
                          handleCustomInput(e.target.value);
                        }}
                        className="w-20 text-center"
                        placeholder="15"
                      />
                      <span className="text-gray-600">questions</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={incrementCount}
                      disabled={questionCount >= 15}
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Preset Options */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Or choose a preset:
                    </h3>

                    {presetOptions.map((option) => (
                      <div
                        key={option.count}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-purple-300 ${
                          questionCount === option.count && !isCustomMode
                            ? "border-purple-500 bg-purple-100"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => handlePresetSelect(option.count)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold text-purple-600">
                              {option.count}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {option.label}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              className={getDifficultyColor(option.difficulty)}
                            >
                              {option.difficulty}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-purple-600"
                            >
                              {getEstimatedTime(option.count)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Range Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>💡 Tip:</strong> You can set anywhere from 1 to 15
                      questions. For best results, we recommend 15 questions to
                      truly test your understanding.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                    variant="outline"
                    className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-pink-300"
                    onClick={() => setActiveTab("upload")}
                  >
                    Return
                  </Button>

                <Button
                  disabled={!isFormComplete}
                  className={`font-medium transition-all duration-200 ${
                    isFormComplete
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continue
                </Button>
              </div>

              {/* Validation Message */}
              {!isFormComplete && (
                <div className="text-center text-red-500 text-sm">
                  Please select a background video, voice type and number of questions to continue
                </div>
              )}
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-purple-700 mb-2">
                  Confirm Your Brain Rot
                </h2>
                <p className="text-purple-600 text-sm">
                  Review your selections and create your very own SkibidiNotes
                  Brain Rot Content.
                </p>
              </div>

              {/* Configuration Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-1 text-sm">Document</h3>
                        {uploadedFiles.length > 0 ? (
                          <ul className="list-disc list-inside text-sm text-gray-900 font-semibold">
                            {uploadedFiles.map((file, idx) => (
                              <li key={idx}>{file.name.split(".")[0]}</li>
                            ))}
                          </ul>
                        ) : (
                          "No file selected"
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-1 text-sm">
                          Background
                        </h3>
                        <p className="text-sm text-gray-900 font-semibold">
                          {selectedBackgroundName !== "" ? (
                            <span>{selectedBackgroundName}</span>
                          ) : (
                            "No background selected"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                         <Mic className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-1 text-sm">
                          Voice Type
                        </h3>
                        <p className="text-sm text-gray-900 font-semibold">
                          {selectedVoiceName !== "" ? (
                            <span>{selectedVoiceName}</span>
                          ) : (
                            "No voice selected"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-gray-900 mb-1 text-sm">
                          Quiz Length
                        </h3>
                        <p className="text-sm text-gray-900 font-semibold">
                          {questionCount}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  className="bg-pink-200 hover:bg-pink-300 text-pink-800 border-pink-300"
                  onClick={() => setActiveTab("customise")}
                >
                  Return
                </Button>
                <Button
                  variant="outline"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={
                    uploadedFiles.length === 0 ||
                    !selectedBackground ||
                    !selectedVoice ||
                    !questionCount
                  }
                  onClick={async () => {
                    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

                    for (const fileObj of uploadedFiles) {
                      const formData = new FormData();
                      formData.append("file", fileObj.file);
                      formData.append("background", selectedBackground);
                      formData.append("voice", selectedVoice); // Use the backend's expected field name
                      formData.append("quizCount", questionCount.toString());

                      const uploadRes = await fetch(
                        `${backendURL}/api/generator/upload?filename=${encodeURIComponent(fileObj.name)}`,
                        {
                          method: "POST",
                          credentials: "include",
                          body: formData,
                        }
                      );
                      if (!uploadRes.ok) {
                        alert(`Failed to upload ${fileObj.name}`);
                        return;
                      }
                    }

                    alert("Successfully sent to backend!");
                  }}
                >
                  Flush
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
