import { forceGetInstance, lazy, omit, pull } from "@lincode/utils"
import { FolderApi, Pane } from "./tweakpane"
import resetIcon from "./icons/resetIcon"
import getDefaultValue, {
    equalsDefaultValue
} from "../../interface/utils/getDefaultValue"
import { Cancellable } from "@lincode/promiselikes"
import { emitEditorEdit } from "../../events/onEditorEdit"
import Appendable from "../../display/core/Appendable"
import getStaticProperties from "../../display/utils/getStaticProperties"
import { emitEditorRefresh } from "../../events/onEditorRefresh"
import { defaultsOptionsMap } from "../../collections/defaultsCollections"
import { tweakpaneDownPtr } from "../../pointers/tweanpaneDownPtr"
import { tweakpaneChangePtr } from "../../pointers/tweakpaneChangePtr"
import { onTransformControls } from "../../events/onTransformControls"
import { refreshInputSystem } from "../../systems/refreshInputSystem"
import unsafeSetValue from "../../utils/unsafeSetValue"

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

const omitOptionsMap = new WeakMap<Record<string, any>, Array<string>>()
const skipChangePtr = [false]

export default async (
    handle: Cancellable,
    pane: Pane,
    title: string,
    target: Appendable,
    params: Record<string, any>,
    prepend?: boolean
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
    const result = Object.fromEntries(
        Object.keys(params).map((key) => {
            const input = lazyFolder().addInput(
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
                    getDefaultValue(target, key, true)
                )
                input.refresh()
                const omitKeys = options && omitOptionsMap.get(options)
                omitKeys && pull(omitKeys, key) && emitEditorRefresh()
            }

            input.on("change", ({ value }: any) => {
                updateResetButton()
                if (skipChangePtr[0]) return
                if (value === "custom" && options) {
                    forceGetInstance(omitOptionsMap, options, Array).push(key)
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
                unsafeSetValue(target, key, processed)
                !tweakpaneDownPtr[0] &&
                    emitEditorEdit({
                        phase: "end",
                        key,
                        value: processed
                    })
            })
            return [key, input]
        })
    )
    handle.then(() => {
        for (const input of Object.values(result)) input.dispose()
    })
    return result
}
