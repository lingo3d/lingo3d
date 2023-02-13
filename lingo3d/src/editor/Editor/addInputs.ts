import { debounce, throttleTrailing } from "@lincode/utils"
import { downPtr, Pane } from "./tweakpane"
import resetIcon from "./icons/resetIcon"
import Defaults, { defaultsOptionsMap } from "../../interface/utils/Defaults"
import getDefaultValue from "../../interface/utils/getDefaultValue"
import { Cancellable } from "@lincode/promiselikes"
import { isPoint } from "../../api/serializer/isPoint"
import { MONITOR_INTERVAL } from "../../globals"
import { emitEditorEdit } from "../../events/onEditorEdit"
import toFixed, { toFixedPoint } from "../../api/serializer/toFixed"
import { timer } from "../../engine/eventLoop"
import {
    assignEditorPresets,
    getEditorPresets
} from "../../states/useEditorPresets"
import connectorInIcon from "./icons/connectorInIcon"
import connectorOutIcon from "./icons/connectorOutIcon"

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

const processValue = (value: any) => {
    if (typeof value === "string") {
        if (value === "true" || value === "false")
            return value === "true" ? true : false
        const num = Number(value)
        if (!Number.isNaN(num)) return toFixed(num)
        return value
    }
    if (typeof value === "number") return toFixed(value)
    if (isPoint(value)) return toFixedPoint(value)
    return value
}

type DraggingItem = { manager: any; prop: string }
let draggingItem: DraggingItem | undefined

export type Connection = {
    onDragStart?: (e: DragEvent) => void
    onDrag?: (e: DragEvent) => void
    onDragEnd?: (e: DragEvent, draggingItem: DraggingItem) => void
    onDrop?: (e: DragEvent, draggingItem: DraggingItem, prop: string) => void
}

export default async (
    handle: Cancellable,
    pane: Pane,
    title: string,
    target: Record<string, any>,
    defaults: Defaults<any>,
    params: Record<string, any>,
    prepend?: boolean,
    noMonitor?: boolean,
    connection?: Connection
) => {
    if (!prepend) await Promise.resolve()

    const paramKeys = Object.keys(params)
    if (!paramKeys.length) return {}

    const paramsBackup = { ...params }
    const paramsDefault: Record<string, any> = {}
    for (const key of paramKeys) {
        if (key.startsWith("preset ")) {
            delete paramsBackup[key]
            params[key] = getEditorPresets()[key] ?? true
        } else
            params[key] = paramsDefault[key] = getDefaultValue(
                defaults,
                key,
                true
            )
    }

    const folder = pane.addFolder({ title })
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
                input.on("change", ({ value }: any) => {
                    if (skipApply) return
                    assignEditorPresets({ [key]: value })
                })
                return [key, input]
            }

            if (!noMonitor) {
                const resetButton = resetIcon.cloneNode(true) as HTMLElement
                input.element.prepend(resetButton)
                resetButton.style.opacity = "0.1"

                const updateResetButton = throttleTrailing(() => {
                    const unchanged = isEqual(
                        params[key] ?? paramsDefault[key],
                        paramsDefault[key]
                    )
                    resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                    resetButton.style.cursor = unchanged ? "auto" : "pointer"
                }, MONITOR_INTERVAL)
                updateResetButton()

                resetButton.onclick = () => {
                    params[key] = structuredClone(paramsDefault[key])
                    target[key] = structuredClone(paramsDefault[key])
                    skipApplyValue()
                    input.refresh()
                }

                input.on("change", ({ value }: any) => {
                    updateResetButton()
                    if (skipApply) return
                    !downPtr[0] && emitEditorEdit("start")
                    target[key] = processValue(value)
                    !downPtr[0] && emitEditorEdit("end")
                })
                return [key, input]
            }

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

            input.on("change", ({ value }: any) => {
                if (skipApply) return
                target[key] = processValue(value)
            })
            return [key, input]
        })
    )
    Object.assign(params, paramsBackup)
    skipApplyValue()
    pane.refresh()

    handle.then(() => {
        folder.dispose()
        for (const input of Object.values(result)) input.dispose()
    })
    if (noMonitor) return result

    handle.watch(
        timer(
            MONITOR_INTERVAL,
            Infinity,
            () => {
                let changed = false
                for (const key of paramKeys)
                    if (
                        !key.startsWith("preset ") &&
                        !isEqual(target[key] ?? paramsDefault[key], params[key])
                    ) {
                        params[key] = target[key]
                        changed = true
                    }
                if (changed) {
                    skipApplyValue()
                    pane.refresh()
                }
            },
            true
        )
    )
    return result
}
