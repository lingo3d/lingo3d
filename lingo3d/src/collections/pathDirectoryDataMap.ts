import { createUnloadMap } from "../utils/createUnloadMap"

export type PathDirectoryData = {
    fileNameOverlap?: string
    isMaterialFolder?: boolean
}

export const pathDirectoryDataMap = createUnloadMap<string, PathDirectoryData>()
