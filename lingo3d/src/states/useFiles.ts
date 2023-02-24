import store from "@lincode/reactivity"
import { FileWithDirectoryAndFileHandle } from "browser-fs-access"

export const [setFiles, getFiles] = store<
    Array<FileWithDirectoryAndFileHandle> | undefined
>(undefined)
