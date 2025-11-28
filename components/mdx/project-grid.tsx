"use client"

import type { FileData } from "@/lib/data"
import { ProjectCard } from "./project-card"

interface ProjectGridProps {
  projects?: FileData[]
  onOpenFile?: (id: string) => void
}

export function ProjectGrid({ projects = [], onOpenFile }: ProjectGridProps) {
  if (!projects.length) {
    return <div className="text-ide-muted italic">No projects found.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onClick={(id) => onOpenFile?.(id)} />
      ))}
    </div>
  )
}
