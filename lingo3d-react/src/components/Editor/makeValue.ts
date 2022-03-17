import { isMultipleSelectionGroup, toFixed } from "./utils"

type MakeValueOptions<T> = Record<string, any> & { format?: (val: T) => T }

export default <T>(
    t: any,
    propName: string,
    defaultValue: T,
    folder: string,
    options?: MakeValueOptions<T>
) => {
    let value: any
    if (isMultipleSelectionGroup(t)) {
        const first = t.outerObject3d.children[0][propName]
        if (t.outerObject3d.children.every((child: any) => child[propName] === first))
            value = first ?? defaultValue
        else
            value = defaultValue
    }
    else value = t[propName] ?? defaultValue

    options?.format && (value = options.format(value))
    typeof value === "number" && (value = toFixed(value))

    return <const>[value, {
        ...options,
        folder,
        onChange: (e: any) => {
            t[propName] = e.value
        }
    }]
}