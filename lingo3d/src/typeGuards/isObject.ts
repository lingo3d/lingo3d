export const isObject = (val: any): val is object =>
    val && typeof val === "object" && !Array.isArray(val)
