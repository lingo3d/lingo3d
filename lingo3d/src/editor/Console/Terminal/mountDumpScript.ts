import { FileSystemTree, WebContainer } from "@webcontainer/api"

const script = `
const fs = require("fs")
const path = require("path")

const set = (obj, path, value) => {
    let target = obj
    const iMax = path.length - 1
    for (let i = 0; i < iMax; ++i) target = target[path[i]] ??= {}

    target[path[iMax]] = value
}

const fileSystemTree = {}
const traverseDirectory = (dirPath) => {
    const files = fs.readdirSync(dirPath)
    for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            traverseDirectory(filePath)
            continue
        }
        const _pathArray = filePath.split("/")
        const pathArray = []
        const iMax = _pathArray.length
        const iLess = iMax - 1
        for (let i = 3; i < iMax; ++i) {
            pathArray.push(_pathArray[i])
            if (i === iLess) pathArray.push("file", "contents")
            else pathArray.push("directory")
        }
        set(fileSystemTree, pathArray, fs.readFileSync(filePath, "utf8"))
    }
}
traverseDirectory(process.cwd())
console.log(JSON.stringify(fileSystemTree))
`

export default (webcontainerInstance: WebContainer) =>
    webcontainerInstance.mount({
        "dump.js": {
            file: {
                contents: script
            }
        }
    } satisfies FileSystemTree)
