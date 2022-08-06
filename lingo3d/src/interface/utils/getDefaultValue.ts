import Defaults from "./Defaults"

export default (defaults: Defaults<any>, key: string, editor?: boolean) => {
    const result = defaults[key]
    if (Array.isArray(result)) return result[editor ? 1 : 0]
    return result
}
