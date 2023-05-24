import { WebContainer, FileSystemTree } from "@webcontainer/api"

const webcontainerInstance = await WebContainer.boot()

const projectFiles: FileSystemTree = {
    myproject: {
        directory: {
            "foo.js": {
                file: {
                    contents: "const x = 1;"
                }
            }
        }
    }
}

await webcontainerInstance.mount(projectFiles)
