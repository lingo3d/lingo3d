import { last, omit, preventTreeShake } from "@lincode/utils"
import { FolderApi, Pane } from "tweakpane"
import settings from "../../api/settings"
import mainCamera from "../../engine/mainCamera"
import { setGridHelper } from "../../states/useGridHelper"
import { setOrbitControls } from "../../states/useOrbitControls"
import { setSelection } from "../../states/useSelection"
import { setSelectionBlockKeyboard } from "../../states/useSelectionBlockKeyboard"
import { setSelectionBlockMouse } from "../../states/useSelectionBlockMouse"
import { h } from "preact"
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks"
import register from "preact-custom-element"
import { useSelectionTarget, useCameraList, useMultipleSelectionTargets, useCameraStack, useDefaultLight, useDefaultFog } from "../states"
import { Cancellable } from "@lincode/promiselikes"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getSecondaryCamera, setSecondaryCamera } from "../../states/useSecondaryCamera"
import deserialize from "../../api/serializer/deserialize"
import serialize from "../../api/serializer/serialize"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import { getMultipleSelection, setMultipleSelection } from "../../states/useMultipleSelection"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import deleteSelected from "./deleteSelected"
import { onKeyClear } from "../../events/onKeyClear"
import { nonEditorSettings } from "../../api/serializer/types"
import { onApplySetup } from "../../events/onApplySetup"
import ISetup from "../../interface/ISetup"
import { isPositionedItem } from "../../api/core/PositionedItem"
import { emitEditorMountChange } from "../../events/onEditorMountChange"
import mainOrbitCamera from "../../engine/mainOrbitCamera"
import getComponentName from "../getComponentName"
import createElement from "../../utils/createElement"
import nonEditorSchemaSet from "../../interface/utils/nonEditorSchemaSet"
import addInputs from "./addInputs"
import addNamedInputs from "./addNamedInputs"

preventTreeShake(h)

const style = createElement(`
    <style>
        .tp-rotv {
            box-shadow: none !important;
            background-color: transparent !important;
        }
        .tp-brkv {
            border-left: none !important;
        }
    </style>
`)
document.head.appendChild(style)

interface EditorProps {
    mouse?: "enabled" | "disabled"
    keyboard?: "enabled" | "disabled"
}

const Editor = ({ mouse, keyboard }: EditorProps) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setSelectionBlockMouse(mouse !== "enabled")
        setSelectionBlockKeyboard(keyboard !== "enabled")

        return () => {
            setSelectionBlockKeyboard(true)
            setSelectionBlockMouse(true)
        }
    }, [mouse, keyboard])

    const [renderDeps, render] = useState({})

    const [cameraStack] = useCameraStack()
    const camera = last(cameraStack)!

    useEffect(() => {
        const currentCamera = camera!

        const init = () => {
            mainOrbitCamera.activate()
            setOrbitControls(true)
            setSelection(true)
            setGridHelper(true)
            render({})
        }
        init()

        const handle0 = onApplySetup(init)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Shift" && e.key !== "Meta" && e.key !== "Control") return
            setMultipleSelection(true)
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key !== "Shift" && e.key !== "Meta" && e.key !== "Control") return
            setMultipleSelection(false)
        }
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        const handle1 = onKeyClear(() => setMultipleSelection(false))
        
        emitEditorMountChange()

        return () => {
            currentCamera.userData.manager.activate()
            setOrbitControls(false)
            setSelection(false)
            setGridHelper(false)

            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
            handle0.cancel()
            handle1.cancel()

            emitEditorMountChange()
        }
    }, [])

    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const [cameraList] = useCameraList()

    const [pane, setPane] = useState<Pane>()
    const [cameraFolder, setCameraFolder] = useState<FolderApi>()

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const editorCameraName = "editor camera"

        const options = cameraList.reduce<Record<string, any>>((acc, cam, i) => {
            acc[i === 0 ? editorCameraName : getComponentName(cam.userData.manager)] = i
            return acc
        }, {})
        const cameraInput = pane.addInput({ "camera": cameraList.indexOf(camera) }, "camera", { options })
        cameraFolder.add(cameraInput)
        cameraInput.on("change", ({ value }) => {
            cameraList[value].userData.manager.activate()
        })

        const secondaryOptions: any = { none: 0, ...omit(options, editorCameraName) }
        const secondaryCameraInput = pane.addInput(
            { "secondary camera": cameraList.indexOf(getSecondaryCamera() ?? mainCamera) },
            "secondary camera",
            { options: secondaryOptions }
        )
        cameraFolder.add(secondaryCameraInput)
        secondaryCameraInput.on("change", ({ value }) => setSecondaryCamera(value === 0 ? undefined : cameraList[value]))

        return () => {
            cameraInput.dispose()
            secondaryCameraInput.dispose()
        }
    }, [pane, cameraFolder, cameraList, camera])

    const [defaultLight, setDefaultLight] = useDefaultLight()
    const defaultLightEnabled = !!defaultLight

    const [defaultFog, setDefaultFog] = useDefaultFog()
    const defaultFogEnabled = !!defaultFog

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })
        setPane(pane)
        setCameraFolder(pane.addFolder({ title: "camera" }))

        if (!selectionTarget) {
            const omitted: Array<keyof ISetup> = ["defaultFog", "defaultLight", "defaultLightScale"]

            const {
                defaultLightEnabled: defaultLightEnabledInput,
                defaultFogEnabled: defaultFogEnabledInput

            } = addInputs(pane, "settings", settings, Object.assign({
                defaultLightEnabled,
                ...defaultLightEnabled && { defaultLight, defaultLightScale: settings.defaultLightScale },
                
                defaultFogEnabled,
                ...defaultFogEnabled && { defaultFog }

            }, omit(settings, [...nonEditorSettings, ...omitted])))

            defaultLightEnabledInput.on("change", ({ value }) => setDefaultLight(value ? "default" : false))
            defaultFogEnabledInput.on("change", ({ value }) => setDefaultFog(value ? "white" : undefined))

            return () => {
                pane.dispose()
            }
        }

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Backspace" || e.key === "Delete") {
                e.preventDefault()
                !getMultipleSelection() && deleteSelected()
                return
            }
            if (e.key.toLowerCase() !== "c") return

            const target = getSelectionTarget()
            if (!target) return

            if (e.metaKey || e.ctrlKey) {
                const [item] = deserialize(serialize(target))
                if (!target.parent || !item) return

                target.parent.attach(item)
                emitSelectionTarget(item)
                return
            }
            isPositionedItem(target) && emitEditorCenterView(target)
        }
        document.addEventListener("keydown", handleKey)

        const target = selectionTarget as any
        const handle = new Cancellable()

        if (!multipleSelectionTargets.length) {
            const { schema, componentName } = target.constructor

            const params: Record<string, any> = {}
            for (const [key, value] of Object.entries(schema)) {
                if (nonEditorSchemaSet.has(key)) continue

                const val = target[key]
                if (value === Function || typeof val === "function") continue
                if (value === Object || (typeof val === "object" && !Array.isArray(val)))
                    if (!val || typeof val.x !== "number" || typeof val.y !== "number")
                        continue
                        
                let v = target[key]
                if (v === Infinity)
                    v = 999999999
                else if (v === -Infinity)
                    v = -999999999
                else if (Array.isArray(v))
                    v = JSON.stringify(v)

                params[key] = v
            }

            if (componentName === "dummy") {
                params.stride = { x: 0, y: 0 }
                const { stride: strideInput } = addNamedInputs(pane, componentName, target, params)
                strideInput.on("change", ({ value }) => {
                    Object.assign(params, {
                        "strideForward": -value.y,
                        "strideRight": value.x
                    })
                    pane.refresh()
                })
            }
            else addNamedInputs(pane, componentName, target, params)
        }

        return () => {
            handle.cancel()
            pane.dispose()
            document.removeEventListener("keydown", handleKey)
        }
    }, [selectionTarget, multipleSelectionTargets, renderDeps, defaultFogEnabled, defaultLightEnabled])

    return (
        <div
         ref={elRef}
         onKeyDown={e => e.stopPropagation()}
         onKeyUp={e => e.stopPropagation()}
         className="lingo3d-ui"
         style={{
             width: 300,
             height: "100%",
             background: "rgb(40, 41, 46)"
         }}
        />
    )
}

register(Editor, "lingo3d-editor", ["mouse", "keyboard"])