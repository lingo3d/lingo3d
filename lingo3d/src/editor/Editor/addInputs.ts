import { debounce } from "@lincode/utils"
import { Pane } from "./tweakpane"
import resetIcon from "./resetIcon"
import Defaults, { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import toFixed from "../../api/serializer/toFixed"

let skipApply = false

let leading = true
export const skipApplyValue = debounce(
    () => {
        skipApply = leading
        leading = !leading
    },
    0,
    "both"
)

const isPoint = (v: any): v is { x: number; y: number; z?: number } =>
    v && typeof v === "object" && "x" in v && "y" in v

const isTrue = (v: any) => v === true || v === "true"
const isFalse = (v: any) => v === false || v === "false"

const isEqual = (a: any, b: any) => {
    if (isPoint(a) && isPoint(b))
        return a.x === b.x && a.y === b.y && a.z === b.z

    if (isTrue(a) && isTrue(b)) return true
    if (isFalse(a) && isFalse(b)) return true

    return a === b
}

const numberChars = new Set("01234567890._".split(""))

export default async (
    pane: Pane,
    title: string,
    target: Record<string, any>,
    defaults: Defaults<any>,
    params: Record<string, any>,
    prepend?: boolean
) => {
    if (!prepend) await new Promise<void>(queueMicrotask)

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
            const input = folder.addInput(params, key, options?.[key] as any)

            const resetButton = resetIcon.cloneNode(true) as HTMLElement
            input.element.prepend(resetButton)
            resetButton.style.opacity = "0.1"

            const updateResetButton = debounce(
                () => {
                    const unchanged = isEqual(params[key], paramsDefault[key])
                    resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                    resetButton.style.cursor = unchanged ? "auto" : "pointer"
                },
                100,
                "trailing"
            )
            updateResetButton()

            resetButton.onclick = () => {
                params[key] = JSON.parse(JSON.stringify(paramsDefault[key]))
                input.refresh()
            }

            input.on("change", ({ value }: any) => {
                updateResetButton()

                if (skipApply) return

                if (typeof value === "string") {
                    if (value === "true" || value === "false") {
                        target[key] = value === "true" ? true : false
                        return
                    }
                    if ([...value].every((char) => numberChars.has(char))) {
                        target[key] = parseFloat(value)
                        return
                    }
                }
                target[key] =
                    typeof value === "number" ? toFixed(key, value) : value
            })
            return [key, input] as const
        })
    )
    Object.assign(params, paramsBackup)
    skipApplyValue()
    for (const input of Object.values(result)) input.refresh()

    return result
}
