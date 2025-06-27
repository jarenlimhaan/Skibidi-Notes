"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProjectCard } from "@/components/ui/library/projectCard"
import { FilterEditor } from "@/components/ui/library/filterEditor"
import { Edit2 } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  createdAt: string
  lastModified: string
  thumbnail: string
  duration?: string
  isFavorite: boolean
  status: "completed" | "in-progress" | "archived"
}

interface CustomFilter {
  id: string
  name: string
  options: string[]
  isActive: boolean
}

interface FilterSettings {
  categories: string[]
  statuses: string[]
  customFilters: CustomFilter[]
}


const sampleProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Dashboard",
    description:
      "A comprehensive dashboard for managing online store operations with analytics and inventory management.",
    category: "Web Development",
    technologies: ["React", "Next.js", "Tailwind CSS", "Chart.js"],
    createdAt: "2024-12-15",
    lastModified: "2024-12-20",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "3:45",
    isFavorite: true,
    status: "completed",
  },
  {
    id: "2",
    title: "Task Management App",
    description: "A mobile-first task management application with team collaboration features.",
    category: "Mobile Development",
    technologies: ["React Native", "TypeScript", "Firebase"],
    createdAt: "2024-12-10",
    lastModified: "2024-12-18",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "2:33",
    isFavorite: false,
    status: "in-progress",
  },
  {
    id: "3",
    title: "Weather API Service",
    description: "RESTful API service for weather data with caching and rate limiting.",
    category: "Backend Development",
    technologies: ["Node.js", "Express", "MongoDB", "Redis"],
    createdAt: "2024-12-05",
    lastModified: "2024-12-12",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "4:12",
    isFavorite: false,
    status: "completed",
  },
  {
    id: "4",
    title: "Portfolio Website",
    description: "Personal portfolio website with blog functionality and contact forms.",
    category: "Web Development",
    technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
    createdAt: "2024-11-28",
    lastModified: "2024-12-01",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "2:15",
    isFavorite: true,
    status: "completed",
  },
  {
    id: "5",
    title: "Data Visualization Tool",
    description: "Interactive data visualization tool for business analytics and reporting.",
    category: "Data Science",
    technologies: ["React", "D3.js", "Python", "FastAPI"],
    createdAt: "2024-11-20",
    lastModified: "2024-11-25",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "5:30",
    isFavorite: false,
    status: "archived",
  },
  {
    id: "6",
    title: "Chat Application",
    description: "Real-time chat application with file sharing and emoji support.",
    category: "Web Development",
    technologies: ["React", "Socket.io", "Node.js", "PostgreSQL"],
    createdAt: "2024-11-15",
    lastModified: "2024-11-22",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "3:22",
    isFavorite: false,
    status: "completed",
  },
]


const defaultFilterSettings: FilterSettings = {
  categories: [
    "All",
    "Web Development",
    "Mobile Development",
    "Backend Development",
    "Data Science",
    "Game Development",
    "Desktop App",
    "Other",
  ],
  statuses: ["All", "completed", "in-progress", "archived"],
  customFilters: [],
}

export default function ProjectLibrary() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    category: "",
    technologies: "",
    duration: "",
    status: "in-progress" as const,
  })

  const [filterSettings, setFilterSettings] = useState<FilterSettings>(defaultFilterSettings)
  const [isFilterEditorOpen, setIsFilterEditorOpen] = useState(false)
  const [customFilterValues, setCustomFilterValues] = useState<Record<string, string>>({})

  // Load projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projectLibrary")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      setProjects(sampleProjects)
      localStorage.setItem("projectLibrary", JSON.stringify(sampleProjects))
    }
  }, [])

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projectLibrary", JSON.stringify(projects))
    }
  }, [projects])

  // Load filter settings from localStorage
  useEffect(() => {
    const savedFilterSettings = localStorage.getItem("projectLibraryFilters")
    if (savedFilterSettings) {
      setFilterSettings(JSON.parse(savedFilterSettings))
    }
  }, [])

  // Save filter settings to localStorage
  useEffect(() => {
    localStorage.setItem("projectLibraryFilters", JSON.stringify(filterSettings))
  }, [filterSettings])

  // Filter projects based on search term, category, status, and custom filters
  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((project) => project.status === selectedStatus)
    }

    // Apply custom filters
    filterSettings.customFilters.forEach((filter) => {
      if (filter.isActive && customFilterValues[filter.id] && customFilterValues[filter.id] !== "All") {
        // This is where you'd implement custom filter logic based on your project structure
        // For now, we'll skip filtering by custom filters since they need to be mapped to project properties
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedCategory, selectedStatus, filterSettings.customFilters, customFilterValues])

  const addProject = () => {
    if (!newProject.title || !newProject.description) return

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      category: newProject.category || "Other",
      technologies: newProject.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      thumbnail: "/placeholder.svg?height=200&width=350",
      duration: newProject.duration,
      isFavorite: false,
      status: newProject.status,
    }

    setProjects((prev) => [project, ...prev])
    setNewProject({
      title: "",
      description: "",
      category: "",
      technologies: "",
      duration: "",
      status: "in-progress",
    })
    setIsAddDialogOpen(false)
  }

  const handleViewProject = (id: string) => {
    console.log("Viewing project:", id)
    // Implement view project logic
  }

  const handleEditProject = (id: string) => {
    console.log("Editing project:", id)
    // Implement edit project logic
  }

  const handleSaveFilterSettings = (settings: FilterSettings) => {
    setFilterSettings(settings)
    // Reset custom filter values when settings change
    setCustomFilterValues({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Project Library</h1>
          <p className="text-gray-600">Manage and organize all your generated projects in one place.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {filterSettings.categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {filterSettings.statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Custom Filters */}
          {filterSettings.customFilters
            .filter((filter) => filter.isActive)
            .map((filter) => (
              <Select
                key={filter.id}
                value={customFilterValues[filter.id] || "All"}
                onValueChange={(value) => setCustomFilterValues((prev) => ({ ...prev, [filter.id]: value }))}
              >
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <SelectValue placeholder={filter.name} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

          <Button variant="outline" onClick={() => setIsFilterEditorOpen(true)} className="bg-white">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Filters
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>Add a new project to your library. Fill in the details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProject.category}
                    onValueChange={(value) => setNewProject((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultFilterSettings.categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, technologies: e.target.value }))}
                    placeholder="React, Next.js, Tailwind CSS"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (optional)</Label>
                  <Input
                    id="duration"
                    value={newProject.duration}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, duration: e.target.value }))}
                    placeholder="2:33"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: any) => setNewProject((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={addProject}>
                  Add Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid - Matching the image layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewProject={handleViewProject}
              onEditProject={handleEditProject}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                <Plus className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "All" || selectedStatus !== "All"
                ? "Try adjusting your search or filters"
                : "Start by adding your first project to the library"}
            </p>
            {!searchTerm && selectedCategory === "All" && selectedStatus === "All" && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            )}
          </div>
        )}
        {/* Filter Editor Dialog */}
        <FilterEditor
          isOpen={isFilterEditorOpen}
          onClose={() => setIsFilterEditorOpen(false)}
          filterSettings={filterSettings}
          onSave={handleSaveFilterSettings}
        />
      </div>
    </div>
  )
}
