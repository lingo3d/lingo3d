import { isPoint } from "../../api/serializer/isPoint"
import toFixed, { toFixedPoint } from "../../api/serializer/toFixed"
import { processValue } from "../Editor/addInputs"
import { Pane } from "./tweakpane"

export default (
    pane: Pane,
    title: string,
    params: Record<string, any>,
    onChange: (key: string, value: any) => void
) => {
    const folder = pane.addFolder({ title })
    const options: Record<string, any> = {}

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
                if ("values" in value) {
                    params[key] = value.value
                    options[key] = {
                        options: Object.fromEntries(
                            value.values.map((item: string) => [item, item])
                        )
                    }
                    break
                }
                if (isPoint(value)) {
                    params[key] = toFixedPoint(value)
                    break
                }
                break
        }

    return Object.fromEntries(
        Object.keys(params).map((key) => {
            const input = folder.addInput(params, key, options[key])
            input.on("change", ({ value }: any) =>
                onChange(key, processValue(value))
            )
            return [key, input] as const
        })
    )
}
