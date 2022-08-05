export default (target: Record<string, any>, keyOrder: Array<string>) => {
    const result: Record<string, any> = {}
    for (const key of keyOrder) result[key] = target[key]

    const keySet = new Set(keyOrder)
    for (const [key, value] of Object.entries(target))
        !keySet.has(key) && (result[key] = value)

    return result
}
