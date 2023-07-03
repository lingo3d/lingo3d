import { forceGetInstance, lazy, omit, pull } from "@lincode/utils"
import { FolderApi, Pane } from "./tweakpane"
import resetIcon from "./icons/resetIcon"
import getDefaultValue, {
    equalsDefaultValue
} from "../../interface/utils/getDefaultValue"
import { Cancellable } from "@lincode/promiselikes"
import { emitEditorEdit } from "../../events/onEditorEdit"
import connectorInIcon from "./icons/connectorInIcon"
import connectorOutIcon from "./icons/connectorOutIcon"
import Appendable from "../../display/core/Appendable"
import { setRuntimeValue } from "../../utils/getRuntimeValue"
import unsafeSetValue from "../../utils/unsafeSetValue"
import { render } from "preact"
import { unmountComponentAtNode } from "preact/compat"
import Toggle from "./Toggle"
import { isPoint } from "../../typeGuards/isPoint"
import executeIcon from "./icons/executeIcon"
import { getOriginalInstance, PassthroughCallback } from "./createParams"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { stopPropagation } from "../utils/stopPropagation"
import { emitEditorRefresh } from "../../events/onEditorRefresh"
import SpawnNode from "../../visualScripting/SpawnNode"
import { uuidMap } from "../../collections/idCollections"
import { defaultsOptionsMap } from "../../collections/defaultsCollections"
import { tweakpaneDownPtr } from "../../pointers/tweanpaneDownPtr"
import { tweakpaneChangePtr } from "../../pointers/tweakpaneChangePtr"
import { clearBooleanPtrEffectSystem } from "../../systems/configSystems/clearBooleanPtrEffectSystem"
import { onTransformControls } from "../../events/onTransformControls"
import { refreshInputSystem } from "../../systems/refreshInputSystem"
import { isDefaultMethodArg } from "../../typeGuards/isDefaultMethodArg"
import { isNullableCallbackParam } from "../../typeGuards/isNullableCallbackParam"
import { isTemplateNode } from "../../typeGuards/isTemplateNode"
import { isNullableCallbackParamInstance } from "../../typeGuards/isNullableCallbackParamInstance"
import { isDefaultMethodArgInstance } from "../../typeGuards/isDefaultMethodArgInstance"

const processValue = (value: any) => {
    if (typeof value === "string") {
        if (!value) return value
        if (value === "true" || value === "false")
            return value === "true" ? true : false
        const num = Number(value)
        if (!Number.isNaN(num)) return num
    }
    return value
}

export type ConnectionDraggingItem = {
    manager: any
    prop: string
    xyz?: "x" | "y" | "z"
}
let draggingItem: ConnectionDraggingItem | undefined

export type Connection = {
    onDragStart?: (e: DragEvent) => void
    onDrag?: (e: DragEvent) => void
    onDragEnd?: (e: DragEvent, draggingItem: ConnectionDraggingItem) => void
    onDrop?: (
        e: DragEvent,
        draggingItem: ConnectionDraggingItem,
        prop: string
    ) => void
}

const initConnectorOut = (
    connectorOut: HTMLElement,
    target: Appendable,
    key: string,
    connection: Connection,
    xyz?: "x" | "y" | "z"
) => {
    stopPropagation(connectorOut)
    connectorOut.draggable = true
    connectorOut.ondragstart = (e) => {
        e.stopPropagation()
        draggingItem = {
            manager: target,
            prop: key,
            xyz
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
    return connectorOut
}

export const initConnectorIn = (
    connectorIn: HTMLElement,
    key: string,
    connection: Connection
) => {
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
    return connectorIn
}

const omitOptionsMap = new WeakMap<Record<string, any>, Array<string>>()
const skipChangePtr = [false]

export default async (
    handle: Cancellable,
    pane: Pane,
    title: string,
    target: Appendable,
    params: Record<string, any>,
    prepend?: boolean,
    connection?: Connection,
    toggle?: boolean
) => {
    if (!prepend) await Promise.resolve()

    const paramKeys = Object.keys(params)
    if (!paramKeys.length) return {}

    const { defaults } = getStaticProperties(target)
    const options = defaultsOptionsMap.get(defaults)
    const optionsOmitted: Record<string, any> | undefined =
        options && omitOptionsMap.has(options)
            ? omit(options, omitOptionsMap.get(options)!)
            : options

    const lazyFolder = lazy(() => {
        const folder: FolderApi = pane.addFolder({ title })
        handle.then(() => folder.dispose())
        return folder
    })
    const lazyCallbacksFolder = lazy(() => {
        const folder: FolderApi = pane.addFolder({ title: "callbacks" })
        handle.then(() => folder.dispose())
        return folder
    })
    const lazyMethodsFolder = lazy(() => {
        const folder: FolderApi = pane.addFolder({ title: "methods" })
        handle.then(() => folder.dispose())
        return folder
    })
    const instance = getOriginalInstance(target)
    const result = Object.fromEntries(
        Object.keys(params).map((key) => {
            let input: any
            const paramValue = params[key]
            if (isDefaultMethodArg(paramValue)) {
                const isDefaultValue = isDefaultMethodArgInstance(paramValue)
                if (isDefaultValue) params[key] = paramValue.value ?? ""

                const execute = () => {
                    const paramValue = params[key]
                    if (isPoint(paramValue))
                        instance[key](paramValue.x, paramValue.y, paramValue.z)
                    else instance[key](paramValue)
                }
                if (
                    (isDefaultValue &&
                        paramValue.value !== undefined &&
                        paramValue.allowInput) ||
                    isPoint(paramValue)
                )
                    input = lazyMethodsFolder().addInput(params, key)
                else {
                    input = lazyMethodsFolder().addButton({
                        title: key,
                        label: key
                    })
                    input.on("click", execute)
                }
                const executeButton = executeIcon.cloneNode(true) as HTMLElement
                input.element.appendChild(executeButton)
                executeButton.onclick = execute
            } else if (isNullableCallbackParam(paramValue)) {
                const isDefaultValue =
                    isNullableCallbackParamInstance(paramValue)
                if (isDefaultValue) params[key] = paramValue.value ?? ""
                if (
                    (isDefaultValue &&
                        paramValue.value !== undefined &&
                        paramValue.allowInput) ||
                    isPoint(paramValue)
                ) {
                    input = lazyCallbacksFolder().addInput(params, key)
                    unsafeSetValue(
                        target,
                        key,
                        // in createParams, callbacks are extended with PassthroughCallback
                        // so that when the callback is called, inputs will be refreshed
                        new PassthroughCallback((val) => {
                            params[key] = val
                            skipChangePtr[0] = true
                            clearBooleanPtrEffectSystem.add(skipChangePtr)
                            input.refresh()
                        }, handle)
                    )
                } else
                    input = lazyCallbacksFolder().addButton({
                        title: key,
                        label: key
                    })
            } else {
                input = lazyFolder().addInput(
                    params,
                    key,
                    optionsOmitted?.[key]
                )
                if (
                    key === "x" ||
                    key === "y" ||
                    key === "z" ||
                    key.startsWith("rotation") ||
                    key.startsWith("scale")
                )
                    handle.watch(
                        onTransformControls((phase) => {
                            if ((skipChangePtr[0] = phase === "start")) {
                                refreshInputSystem.add(input, {
                                    key,
                                    params,
                                    target
                                })
                                return
                            }
                            refreshInputSystem.delete(input)
                        })
                    )
                const resetButton = resetIcon.cloneNode(true) as HTMLElement
                input.element.prepend(resetButton)

                const updateResetButton = () => {
                    const unchanged =
                        equalsDefaultValue(params[key], target, key) &&
                        !(options && omitOptionsMap.get(options)?.includes(key))
                    resetButton.style.opacity = unchanged ? "0.1" : "0.5"
                    resetButton.style.cursor = unchanged ? "auto" : "pointer"
                }
                updateResetButton()

                resetButton.onclick = () => {
                    params[key] = structuredClone(
                        getDefaultValue(target, key, true, true)
                    )
                    input.refresh()
                    const omitKeys = options && omitOptionsMap.get(options)
                    omitKeys && pull(omitKeys, key) && emitEditorRefresh()
                }

                input.on("change", ({ value }: any) => {
                    updateResetButton()
                    if (skipChangePtr[0]) return
                    if (value === "custom" && options) {
                        forceGetInstance(omitOptionsMap, options, Array).push(
                            key
                        )
                        emitEditorRefresh()
                        return
                    }
                    const processed = processValue(value)
                    !tweakpaneDownPtr[0] &&
                        emitEditorEdit({
                            phase: "start",
                            key,
                            value: processed
                        })
                    tweakpaneChangePtr[0] = [key, processed]
                    setRuntimeValue(target, defaults, key, processed)
                    if (isTemplateNode(instance)) {
                        const spawnNode = uuidMap.get(
                            instance.spawnNode
                        ) as SpawnNode
                        unsafeSetValue(
                            forceGetInstance(
                                spawnNode.patch,
                                instance.uuid,
                                Object
                            ),
                            key,
                            processed
                        )
                    }
                    !tweakpaneDownPtr[0] &&
                        emitEditorEdit({
                            phase: "end",
                            key,
                            value: processed
                        })
                })
            }

            if (connection) {
                const els = input.element.querySelectorAll(".tp-pndtxtv_a")
                if (els.length) {
                    let i = 0
                    for (const el of els) {
                        const xyz = "xyz"[i++] as "x" | "y" | "z"
                        const connectorOut = initConnectorOut(
                            connectorOutIcon.cloneNode(true) as HTMLElement,
                            target,
                            key,
                            connection,
                            xyz
                        )
                        connectorOut.id =
                            target.uuid + " " + key + "-" + xyz + " out"
                        const { nextElementSibling } = el
                        if (nextElementSibling)
                            el.parentElement.insertBefore(
                                connectorOut,
                                nextElementSibling
                            )
                        else el.parentElement.appendChild(connectorOut)
                        el.parentElement.classList.add("lingo3d-flexcenter")
                    }
                    return [key, input]
                }
                const connectorOut = initConnectorOut(
                    connectorOutIcon.cloneNode(true) as HTMLElement,
                    target,
                    key,
                    connection
                )
                connectorOut.id = target.uuid + " " + key + " out"
                input.element.appendChild(connectorOut)

                const connectorIn = initConnectorIn(
                    connectorInIcon.cloneNode(true) as HTMLElement,
                    key,
                    connection
                )
                connectorIn.id = target.uuid + " " + key + " in"
                input.element.prepend(connectorIn)
            }
            if (toggle) {
                const div = document.createElement("div")
                render(<Toggle manager={target} property={key} />, div)
                handle.then(() => unmountComponentAtNode(div))
                input.element.appendChild(div)
            }
            return [key, input]
        })
    )
    handle.then(() => {
        for (const input of Object.values(result)) input.dispose()
    })
    return result
}
