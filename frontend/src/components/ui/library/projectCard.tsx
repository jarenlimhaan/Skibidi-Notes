"use client"

import { Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Project } from "../types/project"

interface ProjectCardProps {
  project: Project
  onViewProject: (id: string) => void
  onEditProject: (id: string) => void
}

export function ProjectCard({ project, onViewProject, onEditProject }: ProjectCardProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-48 object-cover bg-gradient-to-br from-blue-100 to-purple-100"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{project.title}</h3>

        {/* Category */}
        <p className="text-sm text-gray-600 mb-4">{project.category}</p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{project.duration || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-sm bg-transparent"
            onClick={() => onViewProject(project.id)}
          >
            View Project ▶
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-sm bg-transparent"
            onClick={() => onEditProject(project.id)}
          >
            Edit 📝
          </Button>
        </div>
      </div>
    </div>
  )
}
