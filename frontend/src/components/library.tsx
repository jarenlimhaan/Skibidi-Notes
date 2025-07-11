"use client";
import { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import { Play, Clock, FileText, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [deletedVideos, setDeletedVideos] = useState<number[]>([]);

  const videos = [
    { id: 1, title: "Cell Respiration", subject: "Biology", duration: "2:33", date: "May 12, 2025", thumbnail: "/subway_gameplay.png?height=200&width=350" },
    { id: 2, title: "Human Reproduction", subject: "Biology", duration: "2:33", date: "May 12, 2025", thumbnail: "/temple_gameplay.png?height=200&width=350" },
    { id: 3, title: "Newton's First Law", subject: "Physics", duration: "2:33", date: "May 12, 2025", thumbnail: "/gta_gameplay.png?height=200&width=350" },
    { id: 4, title: "Photosynthesis Process", subject: "Biology", duration: "3:45", date: "May 10, 2025", thumbnail: "/minecraft_gameplay.png?height=200&width=350" },
    { id: 5, title: "Quantum Mechanics", subject: "Physics", duration: "4:12", date: "May 8, 2025", thumbnail: "/subway_gameplay.png?height=200&width=350" },
    { id: 6, title: "Organic Chemistry Basics", subject: "Chemistry", duration: "3:28", date: "May 6, 2025", thumbnail: "/minecraft_gameplay.png?height=200&width=350" },
    { id: 7, title: "Calculus Integration", subject: "Mathematics", duration: "5:15", date: "May 4, 2025", thumbnail: "/subway_gameplay.png?height=200&width=350" },
    { id: 8, title: "DNA Replication", subject: "Biology", duration: "2:58", date: "May 2, 2025", thumbnail: "/temple_gameplay.png?height=200&width=350" },
  ];

  const subjects = ["ALL", "Biology", "Physics", "Chemistry", "Mathematics"];

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === "ALL" || video.subject === selectedSubject;
      const notDeleted = !deletedVideos.includes(video.id);
      return matchesSearch && matchesSubject && notDeleted;
    });
  }, [searchTerm, selectedSubject, deletedVideos]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 p-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Heading */}
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

              {/* Subject Filter Dropdown */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48 bg-gradient-to-r from-purple-800/30 via-blue-800/30 to-pink-800/30 border-cyan-400/30 text-cyan-300 rounded-xl h-12">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-pink-900/95 backdrop-blur-sm border-cyan-400/30 rounded-xl">
                  {subjects.map((subject) => (
                    <SelectItem
                      key={subject}
                      value={subject}
                      className="text-cyan-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-pink-500/20 rounded-lg"
                    >
                      {subject === "ALL" ? "All Subjects" : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""} found
                {selectedSubject !== "ALL" && <span className="text-pink-300"> in {selectedSubject}</span>}
              </p>
            </div>
          </div>

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
                  key={video.id}
                  className="group relative bg-gradient-to-br from-purple-800/50 via-blue-800/50 to-pink-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-pink-300 font-medium text-sm uppercase tracking-wider">
                        {video.subject}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-cyan-200">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{video.duration}</span>
                      </div>
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
                          if (window.confirm(`Are you sure you want to delete "${video.title}"?`)) {
                            setDeletedVideos((prev) => [...prev, video.id]);
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
        </div>
      </div>
    </>
  );
}
