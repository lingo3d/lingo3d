import Defaults from "./Defaults"
import NullableDefault from "./NullableDefault"

export default (defaults: Defaults<any>, key: string, editor?: boolean) => {
    const result = defaults[key]
    if (result instanceof NullableDefault)
        return editor ? result.value : undefined
    if (editor) return result ?? ""
    return result
}
