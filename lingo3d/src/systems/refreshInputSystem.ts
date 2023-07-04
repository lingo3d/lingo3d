import { getFixedValue } from "../api/serializer/toFixed"
import Appendable from "../display/core/Appendable"
import { InputBindingApi } from "../editor/Editor/tweakpane"
import createInternalSystem from "./utils/createInternalSystem"

export const refreshInputSystem = createInternalSystem("refreshInputSystem", {
    data: {} as {
        key: string
        params: any
        target: Appendable
    },
    update: (input: InputBindingApi, { key, params, target }) => {
        const val = getFixedValue(target, key)
        if (params[key] === val) return
        params[key] = val
        input.refresh()
    }
})
