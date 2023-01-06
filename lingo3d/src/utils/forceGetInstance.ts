import { Class } from "@lincode/utils"

type ForceGetInstance = {
    <Key, Val>(
        map: Map<Key, Val>,
        obj: Key,
        ValClass: Class<Val>,
        params?: Array<unknown>
    ): Val
    <Key extends object, Val>(
        map: WeakMap<Key, Val>,
        obj: Key,
        ValClass: Class<Val>,
        params?: Array<unknown>
    ): Val
}

export const forceGetInstance: ForceGetInstance = (
    map: Map<unknown, unknown> | WeakMap<any, unknown>,
    obj: unknown,
    ValClass: Class<unknown>,
    params: Array<unknown> = []
) => {
    if (!map.has(obj)) {
        const item = new ValClass(...params)
        map.set(obj, item)
        return item
    }
    return map.get(obj)
}
