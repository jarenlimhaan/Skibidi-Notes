"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/navbar2";
import { Play, FileText, Search, Trash2 } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Save } from "lucide-react";
import { X } from "lucide-react";
import { Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [newVideoTitle, setNewVideoTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] =
    useState<UploadWithGenerations | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deletedVideos, setDeletedVideos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query

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
    if (!searchQuery) {
      return videos;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return videos.filter((video) =>
      video.file_name.toLowerCase().includes(lowerCaseQuery)
    );
  }, [videos, searchQuery]);

  const handleWatch = (generation: UploadWithGenerations) => {
    setSelectedVideo(generation);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedVideo(null);
  };

  const handleDelete = (videoId: string) => {
    console.log(`Deleting video ${videoId}`);
    setVideos(videos.filter((video) => video.uploadId !== videoId));
  };

  const handleEdit = (video: (typeof videos)[0]) => {
    setEditingVideoId(video.uploadId);
    setNewVideoTitle(video.file_name);
  };

  const handleSaveRename = (videoId: string) => {
    setVideos(
      videos.map((video) =>
        video.uploadId === videoId
          ? { ...video, file_name: newVideoTitle }
          : video
      )
    );
    setEditingVideoId(null);
    setNewVideoTitle("");
  };

  const handleCancelEdit = () => {
    setEditingVideoId(null);
    setNewVideoTitle("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <Navbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-purple-700 mb-2">
              SkibidiNotes Video Library
            </h1>
            <p className="text-gray-600">Your Certified Skibidi Study Mess</p>
          </div>

          {/* Search and Create Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Hunt For Brainrot Clips..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery} // Bind value to state
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              onClick={() => (window.location.href = "/create")}
            >
              <Plus className="w-4 h-4" />
              Create Video
            </Button>
          </div>

          {/* Results Counter */}
          {/* <div className="text-center">
          <p className="text-purple-800 text-center">
            {filteredVideos.length} video
            {filteredVideos.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div> */}

          {/* Loading/Error States */}
          {loading && <div>Loading videos...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos &&
              filteredVideos.map((video) => (
                <Card
                  key={video.uploadId}
                  className="overflow-hidden p-0 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white/60 to-purple-50/80 backdrop-blur-sm border border-white/30"
                >
                  {/* Thumbnail */}
                  <CardContent className="p-0">
                    {/* Video Thumbnail */}
                    <div className="relative">
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
                                  : video.background_type ===
                                      "minecraft_parkour"
                                    ? "/minecraft_gameplay.png?height=120&width=160"
                                    : "/placeholder_thumbnail.jpg" // Fallback thumbnail
                        }
                        alt={video.file_name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /> */}
                    </div>

                    {/* Content */}
                    <div className="px-4 pt-4 pb-4">
                      <div className="h-[80px]">
                        {" "}
                        {/* Fixed height for consistent layout */}
                        {editingVideoId === video.uploadId ? (
                          <input
                            type="text"
                            value={newVideoTitle}
                            onChange={(e) => setNewVideoTitle(e.target.value)}
                            className="w-full px-2 py-1 mb-2 text-lg font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveRename(video.uploadId);
                              }
                            }}
                          />
                        ) : (
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
                            {video.file_name}
                          </h3>
                        )}
                        <p className="text-sm text-gray-600 mb-4">
                          Spawned {video.date}
                        </p>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex gap-2 items-center w-full mt-1">
                        {" "}
                        {/* Added mt-4 for spacing */}
                        {editingVideoId === video.uploadId ? (
                          <>
                            <Button
                              onClick={() => handleSaveRename(video.uploadId)}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                            >
                              <Save className="w-4 h-4" />
                              Seal
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              className="flex-1 flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 text-white"
                            >
                              <X className="w-4 h-4" />
                              Abort
                            </Button>
                            <div className="flex-1" />{" "}
                            {/* Placeholder to maintain 3-column layout */}
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleWatch(video)}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            >
                              <Play className="w-4 h-4" />
                              Watch
                            </Button>

                            <Button
                              variant="outline"
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                              onClick={() =>
                                (window.location.href = "/quiz/" + video.quizID)
                              }
                            >
                              <HelpCircle className="w-4 h-4" />
                              Quiz
                            </Button>
                            <Button
                              onClick={() => handleEdit(video)}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white"
                            >
                              <Edit className="w-4 h-4" />
                              Tweak
                            </Button>
                          </>
                        )}
                        <Button //make this change 
                          variant="outline"
                          className="flex-shrink-0 bg-transparent text-red-600 hover:bg-red-700 hover:text-white border border-red-600"
                          onClick={() => {
                            Swal.fire({
                              title: "Flush this project down the toilet?",
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
                                    // Remove the video from the state
                                    handleDelete(video.uploadId);
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
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {/* Video Popup */}
          <Popup
            open={isPopupOpen}
            video={selectedVideo}
            onClose={handleClosePopup}
          />

          {/* Empty State */}
          {filteredVideos.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
                <p>Try adjusting your search or create new content.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
