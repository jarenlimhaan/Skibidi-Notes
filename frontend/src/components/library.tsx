"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/navbar";
import { Play, Clock, FileText, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { create } from "domain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface Generation {
  id: string;
  file_path: string;
  background_type: string;
  created_at: string;
}

interface UploadWithGenerations {
  uploadId: string;
  file_name: string;
  file_path: string;
  date: string;
  background_type: string;
}

export default function Library() {
  const [videos, setVideos] = useState<UploadWithGenerations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Generation | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deletedVideos, setDeletedVideos] = useState<string[]>([]);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetchUserVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendURL}/api/generator/uploads_with_generations`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        
        const formatted = data.map((item: any) => ({
          uploadId: item[0],
          background_type: item[1][0].background_type,
          file_name: item[1][0].file_name,
          file_path: item[1][0].file_path,
          date: new Date(item[1][0].created_at).toLocaleDateString(), // Converts ISO to date stamp
        }));
        console.log("Fetched videos:", data);
        console.log("Fetched videos:", formatted);
        setVideos(formatted);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchUserVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    return videos
      .filter(
        (video) =>
          video.file_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !deletedVideos.includes(video.uploadId)
      );
  }, [videos, searchTerm, deletedVideos]);

  const handleWatch = (generation: Generation) => {
    setSelectedVideo(generation);
    setIsPopupOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 p-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-600 via-pink-800 to-purple-800 bg-clip-text text-transparent">
            Skibidi Notes Video Library
          </h1>

          {/* Search & Filter */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4 justify-center items-center max-w-6xl mx-auto">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gradient-to-r from-purple-800/30 via-blue-800/30 to-pink-800/30 border-cyan-400/30 text-white placeholder-cyan-300/70 focus:border-pink-400/60 focus:ring-pink-400/30 rounded-xl h-12"
                  />
                </div>
  
                {/* Create Video Button */}
                <Button
                  onClick={() => (window.location.href = "/create")}
                  variant="outline"
                  className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-400/50 text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/40 hover:to-cyan-500/40 hover:text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:scale-105 h-12"
                >
                  <span className="text-lg">+</span>
                  <span className="text-sm font-semibold">Create Video</span>
                </Button>
              </div>
  
              {/* Results Counter */}
              <div className="text-center">
                <p className="text-cyan-300 text-sm">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""}                
                </p>
              </div>
            </div>

          {/* Loading/Error States */}
          {loading && <div>Loading videos...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🌊</div>
                  <h3 className="text-2xl font-bold text-cyan-300 mb-2">No videos found</h3>
                  <p className="text-pink-300">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredVideos.map((video) => (
                  <div
                    key={video.uploadId}
                    className="group relative bg-gradient-to-br from-purple-800/50 via-blue-800/50 to-pink-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          video.background_type === "subway"
                          ? "/subway_gameplay.png?height=120&width=160"
                          : video.background_type === "temple"
                          ? "/temple_gameplay.png?height=120&width=160"
                          : video.background_type === "minecraft"
                          ? "/minecraft_gameplay.png?height=120&width=160"
                          : video.background_type === "gta"
                          ? "/gta_gameplay.png?height=120&width=160"
                          : "/placeholder_thumbnail.jpg" // Fallback thumbnail
                        }
                        alt={video.file_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
  
                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {video.file_name}
                        </h3>
    
                      </div>
  
                      <div className="flex items-center justify-between text-sm text-cyan-200">
                        <span>{video.date}</span>
                      </div>
  
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/40 hover:to-blue-500/40 hover:text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 border text-xs"
                          variant="outline"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Watch
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/50 text-pink-300 hover:bg-gradient-to-r hover:from-pink-500/40 hover:to-purple-500/40 hover:text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 text-xs"
                          onClick={() => (window.location.href = "/quiz")}
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Quiz
                        </Button>
                        <Button
                          variant="outline"
                          className="w-10 h-10 p-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 text-red-300 hover:bg-gradient-to-r hover:from-red-500/40 hover:to-pink-500/40 hover:text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${video.file_name}"?`)) {
                              setDeletedVideos((prev) => [...prev, video.uploadId]);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          {/* Video Popup */}
          <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedVideo ? "Video Preview" : ""}
                </DialogTitle>
              </DialogHeader>
              {selectedVideo && (
                <video
                  src={selectedVideo.file_path}
                  controls
                  width="100%"
                  className="rounded-lg"
                  style={{ maxHeight: 400 }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}



