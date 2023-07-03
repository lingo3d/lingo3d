import createMap from "../utils/createMap"

export type PathDirectoryData = {
    fileNameOverlap?: string
    isMaterialFolder?: boolean
}

export const pathDirectoryDataMap = createMap<string, PathDirectoryData>()
