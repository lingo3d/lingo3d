import { splitFileName } from "@lincode/utils"

const objectURLExtensionMap = new Map<string, string>()
export default objectURLExtensionMap

export const getExtensionIncludingObjectURL = (src: string) =>
    objectURLExtensionMap.get(src) ?? splitFileName(src)[1]?.toLowerCase()
