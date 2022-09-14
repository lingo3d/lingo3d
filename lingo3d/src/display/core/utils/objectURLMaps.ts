import { splitFileName } from "@lincode/utils"

export const objectURLExtensionMap = new Map<string, string>()
export const fileObjectURLMap = new WeakMap<File, string>()
export const objectURLFileMap = new Map<string, File>()

export const getExtensionIncludingObjectURL = (src: string) =>
    objectURLExtensionMap.get(src) ?? splitFileName(src)[1]?.toLowerCase()
