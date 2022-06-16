export default (target: Record<string, any>, keys: Array<string>) => {    
    let result0: Record<string, any> | undefined
    for (const key of keys)
        key in target && ((result0 ??= {})[key] = target[key])

    const keySet = new Set(keys)
    const result1: Record<string, any> = {}
    for (const [key, value] of Object.entries(target))
        !keySet.has(key) && (result1[key] = value)
    
    return <const>[result0, result1]
}