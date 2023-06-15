import Appendable from "../display/core/Appendable"
import { InputBindingApi } from "../editor/Editor/tweakpane"
import { getFixedRuntimeValue } from "../utils/getRuntimeValue"
import createInternalSystem from "./utils/createInternalSystem"

export const refreshInputSystem = createInternalSystem("refreshInputSystem", {
    data: {} as {
        key: string
        params: any
        target: Appendable
    },
    update: (input: InputBindingApi, { key, params, target }) => {
        const val = getFixedRuntimeValue(target, key)
        if (params[key] === val) return
        params[key] = val
        input.refresh()
    }
})
