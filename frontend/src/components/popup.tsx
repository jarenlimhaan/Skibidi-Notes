"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { FileText, Eye, Download } from "lucide-react" // Removed Trash2
import { useState, useRef } from "react"

interface Document {
  id: string
  name: string
  size: string
  url: string
  type: string
}

export default function Popup() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Project Proposal.pdf",
      size: "2.4 MB",
      url: "/placeholder.svg?height=600&width=400",
      type: "application/pdf",
    },
    {
      id: "2",
      name: "Financial Report Q4.pdf",
      size: "1.8 MB",
      url: "/placeholder.svg?height=600&width=400",
      type: "application/pdf",
    },
    {
      id: "3",
      name: "User Manual.pdf",
      size: "5.2 MB",
      url: "/placeholder.svg?height=600&width=400",
      type: "application/pdf",
    },
    {
      id: "4",
      name: "Contract Agreement.pdf",
      size: "892 KB",
      url: "/placeholder.svg?height=600&width=400",
      type: "application/pdf",
    },
  ])

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type === "application/pdf") {
          const newDocument: Document = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            url: URL.createObjectURL(file),
            type: file.type,
          }
          setDocuments((prev) => [newDocument, ...prev])
        }
      })
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Removed handleDelete function as it's no longer needed

  const handlePreview = (document: Document) => {
    setSelectedDocument(document)
    setIsPreviewOpen(true)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* This is the button that will trigger the popup */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <FileText className="h-5 w-5" />
            Open Document Browser
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Documents
            </DialogTitle>
            <DialogDescription>Manage and view your uploaded PDF documents</DialogDescription>
            <div className="pt-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Quiz
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-1">
              {/* Video Preview Section */}
              <div className="relative p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                  <video
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    poster="/placeholder.svg?height=400&width=600"
                    controls
                    preload="metadata"
                  >
                    <source src="/placeholder.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Smooth overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Loading spinner overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>

                <div className="mt-4 text-center transform transition-all duration-300 hover:translate-y-[-2px]">
                  <h3 className="font-medium text-gray-900 transition-colors duration-200">Document Preview Video</h3>
                  <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-gray-600">
                    Click play to watch the document overview
                  </p>
                </div>
              </div>

              <Separator />

              {/* Documents List */}
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents uploaded yet</p>
                      <p className="text-sm">Upload your first PDF to get started</p>
                    </div>
                  ) : (
                    documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{document.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{document.size}</span>
                            </div>
                            <Badge variant="secondary">PDF</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(document)}
                              className="gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement("a")
                                link.href = document.url
                                link.download = document.name
                                link.click()
                              }}
                              className="gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                            {/* Removed Delete Button */}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedDocument?.name}
            </DialogTitle>
            <DialogDescription>PDF Preview - {selectedDocument?.size}</DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <div className="flex-1 min-h-0">
              <iframe
                src={selectedDocument.url}
                className="w-full h-[600px] border rounded-lg"
                title={selectedDocument.name}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
