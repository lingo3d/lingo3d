const target = {} as any

export default <T extends object>() => {
    let t: any

    return new Proxy<T>(target, {
        get(_, prop) {
            if (prop === "__target") return t
            return t?.[prop]
        },
        set(_, prop, val) {
            if (prop === "__target") {
                t = val
                return true
            }
            if (!t) return true
            
            t[prop] = val
            return true
        }
    })
}