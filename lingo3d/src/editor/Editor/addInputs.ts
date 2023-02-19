import { throttleTrailing } from "@lincode/utils"
import { downPtr, FolderApi, InputBindingApi, Pane } from "./tweakpane"
import resetIcon from "./icons/resetIcon"
import Defaults, { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue, {
    equalsDefaultValue,
    equalsValue
} from "../../interface/utils/getDefaultValue"
import { Cancellable } from "@lincode/promiselikes"
import { emitEditorEdit } from "../../events/onEditorEdit"
import {
    assignEditorPresets,
    getEditorPresets
} from "../../states/useEditorPresets"
import connectorInIcon from "./icons/connectorInIcon"
import connectorOutIcon from "./icons/connectorOutIcon"
import renderSystemWithData from "../../utils/renderSystemWithData"
import Appendable from "../../api/core/Appendable"
import unsafeSetValue from "../../utils/unsafeSetValue"
import unsafeGetValue from "../../utils/unsafeGetValue"
import { nullableCallbackParams } from "../../interface/utils/NullableCallback"

const processValue = (value: any) => {
    if (typeof value === "string") {
        if (value === "true" || value === "false")
            return value === "true" ? true : false
        const num = Number(value)
        if (!Number.isNaN(num)) return num
    }
    return value
}

type DraggingItem = { manager: any; prop: string }
let draggingItem: DraggingItem | undefined

const skipChangeSet = new WeakSet<InputBindingApi>()
const [addRefreshSystem, deleteRefreshSystem] = renderSystemWithData(
    (
        input: InputBindingApi,
        {
            key,
            defaults,
            params,
            target
        }: {
            key: string
            defaults: Defaults<any>
            params: any
            target: Appendable
        }
    ) => {
        const val = unsafeGetValue(target, key)
        if (equalsValue(target, val, params[key], defaults, key)) return
        params[key] = val
        skipChangeSet.add(input)
        input.refresh()
    }
)

export type Connection = {
    onDragStart?: (e: DragEvent) => void
    onDrag?: (e: DragEvent) => void
    onDragEnd?: (e: DragEvent, draggingItem: DraggingItem) => void
    onDrop?: (e: DragEvent, draggingItem: DraggingItem, prop: string) => void
}

export class PassthroughCallback {
    public constructor(
        public callback: (val: any) => void,
        public handle: Cancellable
    ) {}
}

export default async (
    handle: Cancellable,
    pane: Pane,
    title: string,
    target: Appendable,
    defaults: Defaults<any>,
    params: Record<string, any>,
    prepend?: boolean,
    connection?: Connection
) => {
    if (!prepend) await Promise.resolve()

    const paramKeys = Object.keys(params)
    if (!paramKeys.length) return {}

    for (const key of paramKeys)
        if (key.startsWith("preset "))
            params[key] = getEditorPresets()[key] ?? true

    const folder: FolderApi = pane.addFolder({ title })
    const options = defaultsOptionsMap.get(defaults)

    const result = Object.fromEntries(
        Object.keys(params).map((key) => {
            const input = folder.addInput(
                params,
                key,
                getEditorPresets()["preset " + key] !== false
                    ? options?.[key]
                    : undefined
            )
            if (key.startsWith("preset ")) {
                input.on("change", ({ value }: any) =>
                    assignEditorPresets({ [key]: value })
                )
                return [key, input]
            }

            if (nullableCallbackParams.has(unsafeGetValue(target, key)))
                unsafeSetValue(
                    target,
                    key,
                    new PassthroughCallback((val: any) => {
                        params[key] = val
                        skipChangeSet.add(input)
                        input.refresh()
                    }, handle)
                )
            else addRefreshSystem(input, { key, defaults, params, target })

            const resetButton = resetIcon.cloneNode(true) as HTMLElement
            input.element.prepend(resetButton)
            resetButton.style.opacity = "0.1"

            const updateResetButton = throttleTrailing(() => {
                const unchanged = equalsDefaultValue(
                    params[key],
                    defaults,
                    key,
                    target
                )
                resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                resetButton.style.cursor = unchanged ? "auto" : "pointer"
            }, 100)
            updateResetButton()

            resetButton.onclick = () => {
                params[key] = structuredClone(
                    getDefaultValue(
                        defaults,
                        key,
                        true,
                        true,
                        undefined,
                        target
                    )
                )
                input.refresh()
            }

            input.on("change", ({ value }: any) => {
                updateResetButton()
                if (skipChangeSet.has(input)) {
                    skipChangeSet.delete(input)
                    return
                }
                !downPtr[0] && emitEditorEdit("start")
                unsafeSetValue(target, key, processValue(value))
                !downPtr[0] && emitEditorEdit("end")
            })

            if (connection) {
                const connectorIn = connectorInIcon.cloneNode(
                    true
                ) as HTMLElement
                connectorIn.id = target.uuid + " " + key + " in"
                input.element.prepend(connectorIn)

                const connectorOut = connectorOutIcon.cloneNode(
                    true
                ) as HTMLElement
                connectorOut.id = target.uuid + " " + key + " out"
                input.element.append(connectorOut)

                connectorOut.draggable = true
                connectorOut.onmousedown = (e) => e.stopPropagation()
                connectorOut.ondragstart = (e) => {
                    e.stopPropagation()
                    draggingItem = {
                        manager: target,
                        prop: key
                    }
                    connectorOut.style.background = "rgba(255, 255, 255, 0.5)"
                    connection.onDragStart?.(e)
                }
                connectorOut.ondrag = (e) => {
                    e.stopPropagation()
                    connection.onDrag?.(e)
                }
                connectorOut.ondragend = (e) => {
                    e.stopPropagation()
                    connectorOut.style.background = ""
                    connection.onDragEnd?.(e, draggingItem!)
                    draggingItem = undefined
                }

                connectorIn.ondragenter = (e) => {
                    e.stopPropagation()
                    connectorIn.style.background = "rgba(255, 255, 255, 0.5)"
                }
                connectorIn.ondragleave = (e) => {
                    e.stopPropagation()
                    connectorIn.style.background = ""
                }
                connectorIn.ondrop = (e) => {
                    e.stopPropagation()
                    connectorIn.style.background = ""
                    draggingItem && connection.onDrop?.(e, draggingItem, key)
                }
            }
            return [key, input]
        })
    )
    handle.then(() => {
        folder.dispose()
        for (const input of Object.values(result)) {
            deleteRefreshSystem(input)
            input.dispose()
        }
    })
    return result
}
