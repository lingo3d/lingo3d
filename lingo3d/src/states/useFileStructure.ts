import store, { merge } from "@lincode/reactivity"

export interface FileStructure {
    [key: string]: FileStructure | File
}

export const [setFileStructure, getFileStructure] = store<FileStructure>({})
export const mergeFileStructure = merge(setFileStructure, getFileStructure)
