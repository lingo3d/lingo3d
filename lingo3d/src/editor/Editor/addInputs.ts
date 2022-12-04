import { debounce, debounceTrailing } from "@lincode/utils"
import { downPtr, Pane } from "../TweakPane/tweakpane"
import resetIcon from "./resetIcon"
import Defaults, { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import { Cancellable } from "@lincode/promiselikes"
import { isPoint } from "../../api/serializer/isPoint"
import { MONITOR_INTERVAL } from "../../globals"
import { emitEditorEdit } from "../../events/onEditorEdit"

let skipApply = false
let leading = true
const skipApplyValue = debounce(
    () => {
        skipApply = leading
        leading = !leading
    },
    0,
    "both"
)

const isTrue = (v: any) => v === true || v === "true"
const isFalse = (v: any) => v === false || v === "false"

const isEqual = (a: any, b: any) => {
    if (isPoint(a) && isPoint(b))
        return a.x === b.x && a.y === b.y && a.z === b.z

    if (isTrue(a) && isTrue(b)) return true
    if (isFalse(a) && isFalse(b)) return true

    return a === b
}

export default async (
    handle: Cancellable,
    pane: Pane,
    title: string,
    target: Record<string, any>,
    defaults: Defaults<any>,
    params: Record<string, any>,
    prepend?: boolean
) => {
    if (!prepend) await Promise.resolve()

    const paramKeys = Object.keys(params)
    if (!paramKeys.length) return {}

    const paramsBackup = { ...params }
    const paramsDefault: Record<string, any> = {}
    for (const key of paramKeys)
        params[key] = paramsDefault[key] = getDefaultValue(defaults, key, true)

    const folder = pane.addFolder({ title })
    const options = defaultsOptionsMap.get(defaults)

    const result = Object.fromEntries(
        Object.keys(params).map((key) => {
            const input = folder.addInput(params, key, options?.[key])

            const resetButton = resetIcon.cloneNode(true) as HTMLElement
            input.element.prepend(resetButton)
            resetButton.style.opacity = "0.1"

            const updateResetButton = debounceTrailing(() => {
                const unchanged = isEqual(params[key], paramsDefault[key])
                resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                resetButton.style.cursor = unchanged ? "auto" : "pointer"
            }, MONITOR_INTERVAL)
            updateResetButton()

            resetButton.onclick = () => {
                params[key] = JSON.parse(JSON.stringify(paramsDefault[key]))
                input.refresh()
            }

            input.on("change", ({ value }: any) => {
                updateResetButton()
                if (skipApply) return
                !downPtr[0] && emitEditorEdit("start")
                target[key] = value
                !downPtr[0] && emitEditorEdit("stop")
            })
            return [key, input] as const
        })
    )
    Object.assign(params, paramsBackup)
    skipApplyValue()
    pane.refresh()

    const interval = setInterval(() => {
        let changed = false
        for (const key of paramKeys)
            if (!isEqual(target[key] ?? paramsDefault[key], params[key])) {
                params[key] = target[key]
                changed = true
            }

        if (changed) {
            skipApplyValue()
            pane.refresh()
        }
    }, MONITOR_INTERVAL)
    handle.then(() => clearInterval(interval))

    return result
}
