"use client"

import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { useState } from "react"
import type { FileData } from "@/lib/data"

interface ExplorerProps {
  fileSystem: Record<string, FileData>
  activeTabId: string | null
  onOpenFile: (id: string) => void
}

interface TreeNode {
  id: string
  name: string
  path: string
  fileData?: FileData
  children: Record<string, TreeNode>
}

function buildTree(fileSystem: Record<string, FileData>): TreeNode[] {
  const root: Record<string, TreeNode> = {}

  for (const file of Object.values(fileSystem)) {
    const parts = file.id.split("/")
    let currentLevel = root

    // If ID is just "works", we treat it as a file at the top level for now,
    // but if "works/microbase" exists, "works" acts as a folder too.
    // In this file system, "works" is a file (works.mdx).

    // We need to handle the case where a node is BOTH a file and a parent (folder).
    // e.g. "works" is a file, but "works/microbase" implies "works" is a directory.

    let currentPath = ""
    for (const [index, part] of parts.entries()) {
      currentPath = currentPath ? `${currentPath}/${part}` : part

      if (!currentLevel[part]) {
        currentLevel[part] = {
          id: currentPath,
          name: part,
          path: currentPath,
          children: {},
        }
      }

      // If this is the last part, attach file data
      if (index === parts.length - 1) {
        currentLevel[part].fileData = file
        // Use the filename from metadata if available, otherwise keep part name
        currentLevel[part].name = file.filename
      }

      currentLevel = currentLevel[part].children
    }
  }

  // Helper to convert map to array and sort
  const toArray = (nodes: Record<string, TreeNode>): TreeNode[] => {
    return Object.values(nodes).sort((a, b) => {
      // Prioritize "about" (profile) at top
      if (a.id === "about") return -1
      if (b.id === "about") return 1

      // Then folders
      const aIsFolder = Object.keys(a.children).length > 0
      const bIsFolder = Object.keys(b.children).length > 0
      if (aIsFolder && !bIsFolder) return -1
      if (!aIsFolder && bIsFolder) return 1

      // Then alphabetical
      return a.name.localeCompare(b.name)
    })
  }

  // Recursively convert children maps to arrays (if needed) or just traverse maps.
  // We'll keep children as Record for easy lookup but iterate with Object.values for rendering.
  return toArray(root)
}

function FileIcon({
  hasChildren,
  isExpanded,
  isSelected,
}: {
  hasChildren: boolean
  isExpanded: boolean
  isSelected: boolean
}) {
  if (hasChildren) {
    if (isExpanded) {
      return (
        <FolderOpen
          size={14}
          className={`mr-2 shrink-0 ${isSelected ? "text-ide-accent" : "text-ide-muted"}`}
        />
      )
    }
    return (
      <Folder
        size={14}
        className={`mr-2 shrink-0 ${isSelected ? "text-ide-accent" : "text-ide-muted"}`}
      />
    )
  }

  return (
    <FileText
      size={14}
      className={`mr-2 shrink-0 ${isSelected ? "text-ide-accent" : "opacity-80"}`}
    />
  )
}

function FileTreeItem({
  node,
  depth,
  activeTabId,
  onOpenFile,
  allFileSystem, // To check if node corresponds to a file
}: {
  node: TreeNode
  depth: number
  activeTabId: string | null
  onOpenFile: (id: string) => void
  allFileSystem: Record<string, FileData>
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = Object.keys(node.children).length > 0

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    // If it's a file, open it
    if (node.fileData) {
      onOpenFile(node.fileData.id)
    }

    // If it has children but NO file data (folder only), toggle expansion
    if (!node.fileData && hasChildren) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
  }

  const isSelected =
    activeTabId === node.id || (node.fileData ? activeTabId === node.fileData.id : false)

  return (
    <div>
      <div
        className={`flex items-center w-full py-1 text-sm select-none ${
          isSelected
            ? "text-ide-accent bg-ide-selection/30 font-medium"
            : "hover:bg-ide-selection/50 hover:text-ide-text"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <button
          type="button"
          className={`mr-1 p-0.5 rounded-sm hover:bg-white/10 flex items-center justify-center border-none bg-transparent cursor-pointer text-ide-muted ${hasChildren ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) handleToggle(e)
          }}
          disabled={!hasChildren}
        >
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <button
          type="button"
          className="flex flex-1 items-center border-none bg-transparent cursor-pointer text-inherit p-0 font-inherit overflow-hidden"
          onClick={handleClick}
        >
          {/* If it has children, treat as folder icon-wise, even if it's a file */}
          {/* If it has children, treat as folder icon-wise, even if it's a file */}
          <FileIcon hasChildren={hasChildren} isExpanded={isExpanded} isSelected={isSelected} />

          <span className="truncate">{node.name}</span>
        </button>
      </div>

      {isExpanded && hasChildren && (
        <div>
          {Object.values(node.children).map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              activeTabId={activeTabId}
              onOpenFile={onOpenFile}
              allFileSystem={allFileSystem}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Explorer({ fileSystem, activeTabId, onOpenFile }: ExplorerProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const tree = buildTree(fileSystem)

  return (
    <div className="h-full flex flex-col bg-ide-panel border-r border-ide-border text-ide-muted select-none">
      <div className="px-5 py-2 text-xs font-bold tracking-wider uppercase flex items-center justify-between">
        <span>Explorer</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <button
          type="button"
          className="flex items-center w-full px-2 py-1 hover:bg-ide-selection/30 text-ide-text text-sm font-bold"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown size={14} className="mr-1" />
          ) : (
            <ChevronRight size={14} className="mr-1" />
          )}
          <span>portfolio</span>
        </button>
        {isExpanded && (
          <div className="flex flex-col">
            {tree.map((node) => (
              <FileTreeItem
                key={node.id}
                node={node}
                depth={1}
                activeTabId={activeTabId}
                onOpenFile={onOpenFile}
                allFileSystem={fileSystem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
