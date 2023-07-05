import { createUnloadMap } from "../utils/createUnloadMap"

export const pathDirectoryHandleMap = createUnloadMap<
    string,
    FileSystemDirectoryHandle
>()
