import { IdeLayout } from "@/components/ide/layout"
import { getAllFiles } from "@/lib/files"

export default async function Home() {
  const fileSystem = await getAllFiles()
  return <IdeLayout initialFileSystem={fileSystem} />
}
