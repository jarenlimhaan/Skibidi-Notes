"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/navbar";
import { Play, FileText, Search, Trash2 } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import Popup from "@/components/popup";

interface UploadWithGenerations {
  uploadId: string;
  file_name: string;
  file_path: string;
  date: string;
  background_type: string;
  quizID: string;
}

export default function Library() {
  const [videos, setVideos] = useState<UploadWithGenerations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] =
    useState<UploadWithGenerations | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deletedVideos, setDeletedVideos] = useState<string[]>([]);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetchUserVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${backendURL}/api/generator/uploads_with_generations`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          uploadId: item[0][0],
          background_type: item[1][0].background_type,
          file_name: item[0][1],
          file_path: item[1][0].file_path,
          date: new Date(item[1][0].created_at).toLocaleDateString(), // Converts ISO to date stamp
          quizID: item[2] ? item[2].id : null, // Assuming quiz ID is in the third element
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
    return videos.filter(
      (video) =>
        video.file_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !deletedVideos.includes(video.uploadId)
    );
  }, [videos, searchTerm, deletedVideos]);

  const handleWatch = (generation: UploadWithGenerations) => {
    setSelectedVideo(generation);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 font-mono">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl text-center font-bold text-purple-700 mb-6">
            Skibidi Notes Video Library
          </h1>

          {/* Search & Filter */}
          <div className="flex items-center gap-4 mb-6 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg bg-white border-purple-300 focus:border-purple-500 rounded-xl shadow-sm"
              />
            </div>

            {/* Create Video Button */}
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white h-12 px-6 text-lg rounded-xl shadow-sm"
              onClick={() => (window.location.href = "/create")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Video
            </Button>
          </div>

          {/* Results Counter */}
          <div className="text-center">
            <p className="text-purple-800 text-center">
              {filteredVideos.length} video
              {filteredVideos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && <div>Loading videos...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🌊</div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                No videos found
              </h3>
              <p className="text-pink-300">
                Try adjusting your search or filter criteria
              </p>
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
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleWatch(video)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 bg-white"
                      onClick={() =>
                        (window.location.href = "/quiz/" + video.quizID)
                      }
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Quiz
                    </Button>
                    <Button
                      variant="outline"
                     className="w-10 h-10 p-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 text-red-300 hover:bg-gradient-to-r hover:from-red-500/40 hover:to-pink-500/40 hover:text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
                      onClick={() => {
                        Swal.fire({
                          title: "Do you want to delete this project?",
                          showDenyButton: true,
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          denyButtonText: `No`,
                        }).then((result) => {
                          /* Read more about isConfirmed, isDenied below */
                          if (result.isConfirmed) {
                            Swal.fire("Deleted!", "", "success");
                            setDeletedVideos((prev) => [
                              ...prev,
                              video.uploadId,
                            ]);
                            // Delete the video from the backend
                            fetch(
                              `${backendURL}/api/generator/delete/upload/${video.uploadId}`,
                              {
                                method: "DELETE",
                                credentials: "include",
                              }
                            )
                              .then((res) => {
                                if (!res.ok) {
                                  throw new Error("Failed to delete video");
                                }
                                return res.json();
                              })
                              .then(() => {
                                Swal.fire(
                                  "Success!",
                                  "Video deleted successfully",
                                  "success"
                                );
                              })
                              .catch((err) => {
                                console.error("Error deleting video:", err);
                                Swal.fire(
                                  "Error deleting video",
                                  err.message,
                                  "error"
                                );
                              });
                          } else if (result.isDenied) {
                            Swal.fire("Changes are not saved", "", "info");
                          }
                        });
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
        <Popup
          open={isPopupOpen}
          video={selectedVideo}
          onClose={handleClosePopup}
        />
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/70 text-lg mb-4">No videos found</div>
          <p className="text-white/60 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Video
          </Button>
        </div>
      )}
    </>
  );
}
