"use client"

import { useState } from "react"
import { Plus, X, Edit2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { FilterSettings, CustomFilter } from "../types/project"

interface FilterEditorProps {
  isOpen: boolean
  onClose: () => void
  filterSettings: FilterSettings
  onSave: (settings: FilterSettings) => void
}

export function FilterEditor({ isOpen, onClose, filterSettings, onSave }: FilterEditorProps) {
  const [settings, setSettings] = useState<FilterSettings>(filterSettings)
  const [newCategory, setNewCategory] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [newCustomFilter, setNewCustomFilter] = useState({ name: "", options: "" })
  const [editingCustomFilter, setEditingCustomFilter] = useState<string | null>(null)

  const addCategory = () => {
    if (newCategory.trim() && !settings.categories.includes(newCategory.trim())) {
      setSettings((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }))
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    if (category !== "All") {
      // Prevent removing "All"
      setSettings((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== category),
      }))
    }
  }

  const addStatus = () => {
    if (newStatus.trim() && !settings.statuses.includes(newStatus.trim())) {
      setSettings((prev) => ({
        ...prev,
        statuses: [...prev.statuses, newStatus.trim()],
      }))
      setNewStatus("")
    }
  }

  const removeStatus = (status: string) => {
    if (status !== "All") {
      // Prevent removing "All"
      setSettings((prev) => ({
        ...prev,
        statuses: prev.statuses.filter((s) => s !== status),
      }))
    }
  }

  const addCustomFilter = () => {
    if (newCustomFilter.name.trim() && newCustomFilter.options.trim()) {
      const filter: CustomFilter = {
        id: Date.now().toString(),
        name: newCustomFilter.name.trim(),
        options: [
          "All",
          ...newCustomFilter.options
            .split(",")
            .map((opt) => opt.trim())
            .filter(Boolean),
        ],
        isActive: true,
      }
      setSettings((prev) => ({
        ...prev,
        customFilters: [...prev.customFilters, filter],
      }))
      setNewCustomFilter({ name: "", options: "" })
    }
  }

  const updateCustomFilter = (id: string, updates: Partial<CustomFilter>) => {
    setSettings((prev) => ({
      ...prev,
      customFilters: prev.customFilters.map((filter) => (filter.id === id ? { ...filter, ...updates } : filter)),
    }))
  }

  const removeCustomFilter = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      customFilters: prev.customFilters.filter((f) => f.id !== id),
    }))
  }

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const handleReset = () => {
    setSettings(filterSettings)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Filters</DialogTitle>
          <DialogDescription>
            Customize your filter categories and options to better organize your projects.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Categories Section */}
          <div>
            <Label className="text-base font-semibold">Categories</Label>
            <p className="text-sm text-gray-600 mb-3">Manage project categories</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {settings.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  {category !== "All" && (
                    <button onClick={() => removeCategory(category)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCategory()}
              />
              <Button onClick={addCategory} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Status Section */}
          <div>
            <Label className="text-base font-semibold">Status Options</Label>
            <p className="text-sm text-gray-600 mb-3">Manage project status options</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {settings.statuses.map((status) => (
                <Badge key={status} variant="secondary" className="flex items-center gap-1">
                  {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== "All" && (
                    <button onClick={() => removeStatus(status)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add new status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addStatus()}
              />
              <Button onClick={addStatus} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Custom Filters Section */}
          <div>
            <Label className="text-base font-semibold">Custom Filters</Label>
            <p className="text-sm text-gray-600 mb-3">Create custom filter categories</p>

            {settings.customFilters.map((filter) => (
              <div key={filter.id} className="border rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{filter.name}</h4>
                    <Badge variant={filter.isActive ? "default" : "secondary"}>
                      {filter.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateCustomFilter(filter.id, { isActive: !filter.isActive })}
                    >
                      {filter.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingCustomFilter(filter.id)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomFilter(filter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {filter.options.map((option) => (
                    <Badge key={option} variant="outline" className="text-xs">
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            {/* Add New Custom Filter */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h4 className="font-medium mb-2">Add New Custom Filter</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Filter name (e.g., Priority, Team, Client)"
                  value={newCustomFilter.name}
                  onChange={(e) => setNewCustomFilter((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Options (comma-separated, e.g., High, Medium, Low)"
                  value={newCustomFilter.options}
                  onChange={(e) => setNewCustomFilter((prev) => ({ ...prev, options: e.target.value }))}
                />
                <Button onClick={addCustomFilter} size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Filter
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
