import Appendable from "../api/core/Appendable"
import { equalsValue } from "../interface/utils/getDefaultValue"
import { getRuntimeValue } from "../utils/getRuntimeValue"
import renderSystemWithData from "./utils/renderSystemWithData"
import { inputSkipChangeSet } from "../collections/inputSkipChangeSet"
import { InputBindingApi } from "../editor/Editor/tweakpane"

export const [addRefreshInputSystem, deleteRefreshInputSystem] =
    renderSystemWithData(
        (
            input: InputBindingApi,
            {
                key,
                params,
                target
            }: {
                key: string
                params: any
                target: Appendable
            }
        ) => {
            const val = getRuntimeValue(target, key)
            if (equalsValue(target, val, params[key], key)) return
            params[key] = val
            inputSkipChangeSet.add(input)
            input.refresh()
        }
    )
