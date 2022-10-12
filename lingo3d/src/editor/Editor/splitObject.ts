export default (target: Record<string, any>, keys: Array<string>) => {
    let objectWithKeys: Record<string, any> = {}
    for (const key of keys) if (key in target) objectWithKeys[key] = target[key]

    const keySet = new Set(keys)
    const objectRest: Record<string, any> = {}
    for (const [key, value] of Object.entries(target))
        if (!keySet.has(key)) objectRest[key] = value

    return <const>[objectWithKeys, objectRest]
}
