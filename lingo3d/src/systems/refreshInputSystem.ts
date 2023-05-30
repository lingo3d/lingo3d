import Appendable from "../display/core/Appendable"
import { equalsValue } from "../interface/utils/getDefaultValue"
import { getRuntimeValue } from "../utils/getRuntimeValue"
import { inputSkipChangeSet } from "../collections/inputSkipChangeSet"
import { InputBindingApi } from "../editor/Editor/tweakpane"
import createSystem from "./utils/createSystem"

export const refreshInputSystem = createSystem({
    data: {} as {
        key: string
        params: any
        target: Appendable
    },
    update: (input: InputBindingApi, { key, params, target }) => {
        const val = getRuntimeValue(target, key)
        if (equalsValue(target, val, params[key], key)) return
        params[key] = val
        inputSkipChangeSet.add(input)
        input.refresh()
    }
})
