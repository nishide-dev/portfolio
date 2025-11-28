import type { MDXRemoteSerializeResult } from "next-mdx-remote"

export type FileData = {
  id: string
  filename: string
  path: string
  icon: string
  pyModule: string
  lang: "markdown" | "python" | "javascript" | "json" | "typescript" | "mdx"
  content: string
  serializedContent?: MDXRemoteSerializeResult
  thumbnail?: string
  tags?: string[]
}

// Initial empty state or default data if needed
export const initialFileSystem: Record<string, FileData> = {}
