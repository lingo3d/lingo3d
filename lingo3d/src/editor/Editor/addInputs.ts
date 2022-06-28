import { debounce } from "@lincode/utils"
import { Pane } from "tweakpane"
import resetIcon from "./resetIcon"
import Defaults from "../../interface/utils/Defaults"

let programmatic = false

let leading = true
export const setProgrammatic = debounce(
    () => {
        programmatic = leading
        leading = !leading
    },
    100,
    "both"
)

const toFixed = (v: any) => (typeof v === "number" ? Number(v.toFixed(2)) : v)

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

export default (
    pane: Pane,
    title: string,
    target: Record<string, any>,
    defaults: Defaults<any>,
    params = { ...target }
) => {
    const folder = pane.addFolder({ title })

    for (const [key, value] of Object.entries(params))
        switch (typeof value) {
            case "undefined":
                params[key] = ""
                break

            case "number":
                params[key] = toFixed(value)
                break

            case "object":
                if (Array.isArray(value)) {
                    params[key] = JSON.stringify(value)
                    break
                }
                typeof value?.x === "number" && (value.x = toFixed(value.x))
                typeof value?.y === "number" && (value.y = toFixed(value.y))
                typeof value?.z === "number" && (value.z = toFixed(value.z))
                break
        }

    return Object.fromEntries(
        Object.keys(params).map((key) => {
            const input = folder.addInput(params, key)

            const resetButton = resetIcon.cloneNode(true) as HTMLElement
            input.element.prepend(resetButton)

            let defaultValue = defaults[key]
            defaultValue =
                (Array.isArray(defaultValue)
                    ? defaultValue[1]
                    : defaultValue) ?? ""

            const unchanged = isEqual(params[key], defaultValue)
            resetButton.style.opacity = unchanged ? "0.1" : "0.5"
            resetButton.style.cursor = unchanged ? "auto" : "pointer"

            resetButton.onclick = () => {
                params[key] = defaultValue
                input.refresh()
            }

            input.on("change", ({ value }) => {
                if (programmatic) return

                const unchanged = isEqual(value, defaultValue)
                resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                resetButton.style.cursor = unchanged ? "auto" : "pointer"

                if (typeof value === "string") {
                    if (value === "true" || value === "false") {
                        target[key] = value === "true" ? true : false
                        return
                    }
                    const num = parseFloat(value)
                    if (!Number.isNaN(num)) {
                        target[key] = num
                        return
                    }
                }
                target[key] = toFixed(value)
            })
            return [key, input] as const
        })
    )
}
