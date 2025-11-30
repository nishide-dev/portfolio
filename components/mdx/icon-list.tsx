"use client"

import React from "react"

interface IconListProps {
  icons: string[]
}

export function IconList({ icons }: IconListProps) {
  return (
    <div className="flex flex-wrap gap-3 my-4">
      {icons.map((icon) => (
        <div
          key={icon}
          className="flex items-center justify-center p-2 bg-ide-panel border border-ide-border rounded-md hover:border-ide-accent/50 transition-colors w-12 h-12"
          title={icon}
        >
          {/* biome-ignore lint/performance/noImgElement: Static assets from public folder */}
          <img
            src={`/stacks/${icon}.svg`}
            alt={icon}
            className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      ))}
    </div>
  )
}
