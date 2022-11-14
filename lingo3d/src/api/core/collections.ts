import Appendable from "./Appendable"

export const appendableRoot = new Set<Appendable>()
export const hiddenAppendables = new WeakSet<Appendable>()
export const nonSerializedAppendables = new WeakSet<Appendable>()
export const uuidMap = new Map<string, Appendable>()
