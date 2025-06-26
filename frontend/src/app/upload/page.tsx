"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

interface FileSummary {
  fileId: string;
  fileName: string;
  summary: string;
  keyPoints: string[];
  wordCount: number;
  status: "generating" | "completed" | "error";
  error?: string;
}

interface Result {
  summary: string;
  keypoints: string[];
}

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [summaries, setSummaries] = useState<FileSummary[]>([]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const generateSummary = async (file: UploadedFile, summary: Result) => {
    if (
      !file.url ||
      (file.type.indexOf("text") === -1 &&
        file.type.indexOf("pdf") === -1 &&
        file.type.indexOf("document") === -1)
    ) {
      return; // Only summarize text-based files
    }

    const newSummary: FileSummary = {
      fileId: file.id,
      fileName: file.name,
      summary: "",
      keyPoints: [],
      wordCount: 0,
      status: "generating",
    };

    setSummaries((prev) => [...prev, newSummary]);

    try {
      const result = summary;

      setSummaries((prev) =>
        prev.map((s) =>
          s.fileId === file.id
            ? {
                ...s,
                status: "completed",
                summary: result.summary,
                keyPoints: result.keypoints,
                wordCount: 100,
              }
            : s
        )
      );
    } catch (error) {
      setSummaries((prev) =>
        prev.map((s) =>
          s.fileId === file.id
            ? { ...s, status: "error", error: "Failed to generate summary" }
            : s
        )
      );
    }
  };

  const uploadFile = async (file: File) => {
    const fileId = Math.random().toString(36).substring(7);
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId && f.progress < 90
              ? { ...f, progress: f.progress + Math.random() * 20 }
              : f
          )
        );
      }, 200);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${backendURL}/api/generator/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "success", progress: 100, url: result.url }
            : f
        )
      );

      // Generate summary for supported file types
      setTimeout(
        () =>
          generateSummary(
            {
              ...newFile,
              status: "success",
              progress: 100,
              url: result.url,
            },
            result.summary
          ),
        1000
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: "error", progress: 0, error: "Upload failed" }
            : f
        )
      );
    }
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      // Check file size (limit to 10MB for demo)
      if (file.size > 10 * 1024 * 1024) {
        const fileId = Math.random().toString(36).substring(7);
        setFiles((prev) => [
          ...prev,
          {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            status: "error",
            progress: 0,
            error: "File size exceeds 10MB limit",
          },
        ]);
        return;
      }

      uploadFile(file);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const retryUpload = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      // Create a new File object for retry (this is a simplified approach)
      // In a real app, you'd need to store the original File object
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Upload Files</h1>
          <p className="text-muted-foreground">
            Drag and drop files here or click to browse
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              File Upload
            </CardTitle>
            <CardDescription>
              Upload files up to 10MB. Supported formats: images, documents, and
              more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum file size: 10MB
                </p>
              </div>
              <Button
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                accept="*/*"
              />
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Progress</CardTitle>
              <CardDescription>
                {files.filter((f) => f.status === "success").length} of{" "}
                {files.length} files uploaded successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <File className="h-8 w-8 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              file.status === "success"
                                ? "default"
                                : file.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {file.status === "success" && (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {file.status === "error" && (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {file.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{formatFileSize(file.size)}</span>
                        <span>{file.type}</span>
                      </div>

                      {file.status === "uploading" && (
                        <Progress value={file.progress} className="h-2" />
                      )}

                      {file.status === "error" && file.error && (
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{file.error}</AlertDescription>
                        </Alert>
                      )}

                      {file.status === "success" && file.url && (
                        <div className="mt-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            View uploaded file
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {summaries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <File className="h-5 w-5" />
                Document Summaries
              </CardTitle>
              <CardDescription>
                AI-generated summaries of your uploaded documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {summaries.map((summary) => (
                  <div
                    key={summary.fileId}
                    className="border rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {summary.fileName}
                      </h3>
                      <Badge
                        variant={
                          summary.status === "completed"
                            ? "default"
                            : summary.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {summary.status === "generating" && "Generating..."}
                        {summary.status === "completed" && "Completed"}
                        {summary.status === "error" && "Failed"}
                      </Badge>
                    </div>

                    {summary.status === "generating" && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-sm">
                          Analyzing document and generating summary...
                        </span>
                      </div>
                    )}

                    {summary.status === "completed" && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Summary</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-md">
                            {summary.summary}
                          </p>
                        </div>

                        {summary.keyPoints.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Key Points</h4>
                            <ul className="space-y-2">
                              {summary.keyPoints.map((point, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span className="text-muted-foreground">
                                    {point}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                          <span>
                            {/* Word count: {summary.wordCount.toLocaleString()} */}
                            Word Count: No
                          </span>
                          <span>•</span>
                          <span>Generated by Heng Rui One Braincell</span>
                        </div>
                      </div>
                    )}

                    {summary.status === "error" && summary.error && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{summary.error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
