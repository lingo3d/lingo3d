export default <T extends object>() => {
    let instance: Record<string | symbol, any> | undefined
    const data: Record<string | symbol, any> = {}

    return new Proxy<T>(data as T, {
        get(_, prop) {
            return instance?.[prop] ?? data[prop]
        },
        set(_, prop, val) {
            if (prop === "__target") {
                instance = val
                for (const [key, value] of Object.entries(data))
                    val[key] = value

                return true
            }
            data[prop] = val
            instance && (instance[prop] = val)
            return true
        }
    })
}
