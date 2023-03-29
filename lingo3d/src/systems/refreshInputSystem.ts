import { InputBindingApi } from "tweakpane"
import Appendable from "../api/core/Appendable"
import { equalsValue } from "../interface/utils/getDefaultValue"
import { getRuntimeValue } from "../utils/getRuntimeValue"
import renderSystemWithData from "./utils/renderSystemWithData"

export const skipChangeSet = new WeakSet<InputBindingApi>()

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
            skipChangeSet.add(input)
            input.refresh()
        }
    )
