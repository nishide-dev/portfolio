import { IdeLayout } from "@/components/ide/layout"
import { getAllFiles } from "@/lib/files"

export default function Home() {
  const fileSystem = getAllFiles()
  return <IdeLayout initialFileSystem={fileSystem} />
}
