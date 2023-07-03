import { createMap } from "../utils/createCollection"

export type PathDirectoryData = {
    fileNameOverlap?: string
    isMaterialFolder?: boolean
}

export const pathDirectoryDataMap = createMap<string, PathDirectoryData>()
