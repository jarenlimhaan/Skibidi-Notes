"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Download } from "lucide-react";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface Document {
  id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

interface PopupProps {
  open: boolean;
  video: {
    uploadId: string;
    file_name: string;
    file_path: string;
    date: string;
    background_type: string;
    quizID: string;
  } | null;
  uploaded_file_path: string | undefined;
  onClose: () => void;
}

export default function Popup({
  open,
  video,
  onClose,
  uploaded_file_path,
}: PopupProps) {
  const [documents, setDocuments] = useState<Document[]>([]);

  React.useEffect(() => {
    const res = uploaded_file_path
      ? uploaded_file_path.slice(
          uploaded_file_path.indexOf("/static/uploads") +
            "/static/uploads".length +
            1
        )
      : "";

    if (uploaded_file_path) {
      setDocuments([
        {
          id: "1",
          name: res,
          size: "2.4 MB",
          url: res,
          type: "application/pdf",
        },
      ]);
    } else {
      setDocuments([]);
    }
  }, [uploaded_file_path]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // PDF preview handler
  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  // PDF download handler
  const handleDownload = async (document: Document) => {
    const response = await fetch(backendURL + "/download/" + document.url);
    if (!response.ok) {
      console.error("Failed to download document:", response.statusText);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = document.name;
    window.document.body.appendChild(a);
    a.click();

    window.document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Generate the correct video poster based on background_type
  const getPoster = () => {
    switch (video?.background_type) {
      case "subway":
        return "/subway_gameplay.png?height=120&width=160";
      case "temple":
        return "/temple_gameplay.png?height=120&width=160";
      case "minecraft":
        return "/minecraft_gameplay.png?height=120&width=160";
      case "gta":
        return "/gta_gameplay.png?height=120&width=160";
      default:
        return "/placeholder_thumbnail.jpg";
    }
  };

  // Generate the correct video source path, handling relative URLs from backend
  const getVideoSrc = () => {
    if (!video?.file_path) return "/placeholder.mp4";
    if (video.file_path.startsWith("http")) return video.file_path;
    // Always prepend backend URL for static files
    return `${backendURL.replace(/\/$/, "")}/${video.file_path.replace(/^\/?/, "")}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden scrollbar-none flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Video Preview
            </DialogTitle>
            <DialogDescription>
              {video?.file_name
                ? `Watch "${video.file_name}" below`
                : "Watch your generated video below"}
            </DialogDescription>
            <div className="pt-2">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => {
                  if (video?.quizID) {
                    window.location.href = `/quiz/${video.quizID}`;
                  }
                }}
                disabled={!video?.quizID}
              >
                <FileText className="h-4 w-4" />
                Quiz
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 ">
            <div className="space-y-4 p-1">
              {/* Video Preview Section */}
                <div className="relative p-1 border rounded-md bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 max-w-2xl mx-auto hover:shadow-sm">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                    <video
                      className="w-full h-full transition-transform duration-300"
                      poster={getPoster()}
                      controls
                      preload="metadata"
                    >
                      <source src={getVideoSrc()} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 pointer-events-none">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
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
                      <p className="text-sm">
                        Ask your admin to add documents to your account
                      </p>
                    </div>
                  ) : (
                    documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {document.name.split("_").pop() || "Untitled Document"}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {/* <span>{document.size}</span> */}
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
                              onClick={() => handleDownload(document)}
                              className="gap-1"
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
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
      {/* PDF Preview Dialog - separate from main Dialog */}
      <Dialog
        open={isPreviewOpen}
        onOpenChange={() => {
          setIsPreviewOpen(false);
          window.location.reload();
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedDocument?.name}
            </DialogTitle>
            <DialogDescription>
              PDF Preview - {selectedDocument?.size}
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="flex-1 min-h-0">
              <iframe
                src={backendURL + "/static/uploads/" + selectedDocument.url}
                className="w-full h-[600px] border rounded-lg"
                title={selectedDocument.name}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
