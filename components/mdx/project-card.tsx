"use client"

import { Briefcase, Folder, Microscope, UserCircle } from "lucide-react"
import type { FileData } from "@/lib/data"

interface ProjectCardProps {
  project: FileData
  onClick: (id: string) => void
}

const IconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "user-circle": UserCircle,
  microscope: Microscope,
  briefcase: Briefcase,
  folder: Folder,
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const Icon = IconMap[project.icon] || Folder

  return (
    <button
      type="button"
      onClick={() => onClick(project.id)}
      className="flex flex-col items-start p-4 border border-ide-border rounded-lg bg-ide-panel hover:bg-ide-selection/50 hover:border-ide-accent transition-all group text-left w-full h-full"
    >
      <div className="mb-3 p-2 rounded-md bg-ide-bg border border-ide-border group-hover:border-ide-accent/50 transition-colors">
        <Icon size={24} className="text-ide-accent" />
      </div>
      <h3 className="text-sm font-bold text-ide-text mb-1 group-hover:text-ide-accent transition-colors">
        {project.filename.replace(/\.(md|mdx|tsx|py|json)$/, "")}
      </h3>
      <p className="text-xs text-ide-muted line-clamp-2">{project.path}</p>
    </button>
  )
}
