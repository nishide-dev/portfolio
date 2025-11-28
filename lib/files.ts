import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import type { FileData } from "./data"

const contentDirectory = path.join(process.cwd(), "content")

export function getAllFiles(): Record<string, FileData> {
  const fileSystem: Record<string, FileData> = {}

  function processFile(fullPath: string, relativePath: string) {
    const fileContent = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContent)
    const id = `/${relativePath.replace(/\.md$/, "")}`
    const fileId = data.id ? `/${data.id}` : id

    fileSystem[fileId] = {
      id: data.id || id.replace(/^\//, ""),
      filename: data.filename || path.basename(fullPath),
      path: `docs > ${data.filename || path.basename(fullPath)}`,
      icon: data.icon || "file-text",
      pyModule: data.pyModule || "module",
      lang: (data.lang as FileData["lang"]) || "markdown",
      content: content,
    }
  }

  function readDirRecursive(dir: string) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        readDirRecursive(fullPath)
      } else if (file.endsWith(".md")) {
        const relativePath = path.relative(contentDirectory, fullPath)
        processFile(fullPath, relativePath)
      }
    }
  }

  readDirRecursive(contentDirectory)
  return fileSystem
}
