"use client"

import type { FileData } from "@/lib/data"

interface ProjectCardProps {
  project: FileData
  onClick: (id: string) => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(project.id)}
      className="flex flex-col items-start p-0 border border-ide-border rounded-lg bg-ide-panel hover:bg-ide-selection/50 hover:border-ide-accent transition-all group text-left w-full h-full overflow-hidden"
    >
      <div className="w-full aspect-video bg-ide-bg border-b border-ide-border relative overflow-hidden">
        {/* biome-ignore lint/performance/noImgElement: Simple image display */}
        <img
          src={project.thumbnail || "/github-avatar.png"}
          alt={project.filename}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="p-4 w-full">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {project.tags?.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-ide-bg border border-ide-border text-[10px] font-medium text-ide-muted"
            >
              <span className="uppercase">{tag}</span>
            </div>
          )) || (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-ide-bg border border-ide-border text-[10px] font-medium text-ide-muted">
              <span className="uppercase">{project.lang === "markdown" ? "MD" : project.lang}</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-bold text-ide-text mb-1 group-hover:text-ide-accent transition-colors">
          {project.filename.replace(/\.(md|mdx|tsx|py|json)$/, "")}
        </h3>
        <p className="text-xs text-ide-muted line-clamp-2">{project.path}</p>
      </div>
    </button>
  )
}
