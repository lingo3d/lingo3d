const traverseObject = (
    obj: unknown,
    cb: (
        k: string | number,
        v: any,
        parent: Record<any, any> | Array<any>,
        path: Array<string | number>
    ) => void,
    traversed = new WeakSet(),
    currentPath: Array<string | number> = []
) => {
    if (Array.isArray(obj)) {
        if (traversed.has(obj)) return
        traversed.add(obj)

        for (let i = 0; i < obj.length; ++i) {
            const v = obj[i]
            cb(i, v, obj, currentPath)
            traverseObject(v, cb, traversed, [...currentPath, i])
        }
    } else if (obj && typeof obj === "object") {
        if (traversed.has(obj)) return
        traversed.add(obj)

        for (const [k, v] of Object.entries(obj)) {
            cb(k, v, obj, currentPath)
            traverseObject(v, cb, traversed, [...currentPath, k])
        }
    }
}
export default traverseObject
