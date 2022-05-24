import { debounce, omit, preventTreeShake } from "@lincode/utils"
import { FolderApi, Pane } from "tweakpane"
import settings from "../../api/settings"
import mainCamera from "../../engine/mainCamera"
import { onTransformControls } from "../../events/onTransformControls"
import { objectManagerSchema } from "../../interface/IObjectManager"
import { getCamera, setCamera } from "../../states/useCamera"
import { setGridHelper } from "../../states/useGridHelper"
import { setOrbitControls } from "../../states/useOrbitControls"
import { setSelection } from "../../states/useSelection"
import { setSelectionBlockKeyboard } from "../../states/useSelectionBlockKeyboard"
import { setSelectionBlockMouse } from "../../states/useSelectionBlockMouse"
import { h } from "preact"
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks"
import register from "preact-custom-element"
import { useSelectionTarget, useCameraList, useMultipleSelectionTargets, useCamera, useDefaultLight, useDefaultFog } from "../states"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import ObjectManager from "../../display/core/ObjectManager"
import { Cancellable } from "@lincode/promiselikes"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { emitSceneChange } from "../../events/onSceneChange"
import { getSecondaryCamera, setSecondaryCamera } from "../../states/useSecondaryCamera"
import deserialize from "../../display/utils/serializer/deserialize"
import serialize from "../../display/utils/serializer/serialize"
import { emitEditorCenterView } from "../../events/onEditorCenterView"
import { setMultipleSelection } from "../../states/useMultipleSelection"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import deleteSelected from "./deleteSelected"
import { onKeyClear } from "../../events/onKeyClear"
import { nonSerializedSettings } from "../../display/utils/serializer/types"
import { onApplySetup } from "../../events/onApplySetup"
import ISetup from "../../interface/ISetup"
import { dummySchema } from "../../interface/IDummy"

preventTreeShake(h)

const toFixed = (v: any) => typeof v === "number" ? Number(v.toFixed(2)) : v

let programmatic = false
const disableProgrammatic = debounce(() => programmatic = false, 100, "trailing")

const addInputs = (
    pane: Pane,
    title: string,
    target: Record<string, any>,
    params = { ...target },
    vectorMap?: Record<string, Array<string>>
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

    return Object.fromEntries(Object.keys(params).map(key => {
        const input = folder.addInput(params, key)
        input.on("change", ({ value }) => {
            if (programmatic) return
            
            if (vectorMap?.[key]) {
                const [xProp, yProp, zProp] = vectorMap[key]
                const { x, y, z } = value
                target[xProp] = toFixed(x)
                target[yProp] = toFixed(y)
                target[zProp] = toFixed(z)
                return
            }

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
    }))
}

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

    useEffect(() => {
        const currentCamera = getCamera()

        const init = () => {
            setCamera(mainCamera)
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
        
        return () => {
            setCamera(currentCamera)
            setOrbitControls(false)
            setSelection(false)
            setGridHelper(false)

            document.removeEventListener("keydown", handleKeyDown)
            document.removeEventListener("keyup", handleKeyUp)
            handle0.cancel()
            handle1.cancel()
        }
    }, [])

    const [selectionTarget] = useSelectionTarget()
    const [multipleSelectionTargets] = useMultipleSelectionTargets()
    const [cameraList] = useCameraList()
    const [camera] = useCamera()

    const [pane, setPane] = useState<Pane>()
    const [cameraFolder, setCameraFolder] = useState<FolderApi>()

    useLayoutEffect(() => {
        if (!pane || !cameraFolder) return

        const options = cameraList.reduce<Record<string, any>>((acc, _, i) => (acc["camera " + i] = i, acc), {})
        const cameraInput = pane.addInput({ "camera": cameraList.indexOf(getCamera()) }, "camera", { options })
        cameraFolder.add(cameraInput)
        cameraInput.on("change", ({ value }) => setCamera(cameraList[value]))

        const secondaryOptions: any = { none: 0, ...omit(options, "camera 0") }
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

            }, omit(settings, [...nonSerializedSettings, ...omitted])))

            defaultLightEnabledInput.on("change", ({ value }) => setDefaultLight(value ? "default" : false))
            defaultFogEnabledInput.on("change", ({ value }) => setDefaultFog(value ? "white" : undefined))

            return () => {
                pane.dispose()
            }
        }

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                deleteSelected()
                return
            }
            if (e.key.toLocaleLowerCase() !== "c") return

            const target = getSelectionTarget()
            if (!target) return

            if (e.metaKey || e.ctrlKey) {
                const [item] = deserialize(serialize(target))
                if (!target.parent || !item) return

                target.parent.attach(item)
                emitSelectionTarget(item)
                return
            }
            emitEditorCenterView(target)
        }
        document.addEventListener("keydown", handleKey)

        const target = selectionTarget as any
        const handle = new Cancellable()

        const makeVectorXYZ = (prop: string) => ({
            x: target[prop + "X"],
            y: target[prop + "Y"],
            z: target[prop + "Z"]
        })
        const makeVector = (x: string, y: string, z: string) => ({
            x: target[x],
            y: target[y],
            z: target[z]
        })
        const makeVectorNames = (prop: string) => [prop + "X", prop + "Y", prop + "Z"]

        if (!multipleSelectionTargets.length) {
            const { name: nameInput } = addInputs(pane, "general", target, {
                name: target.name,
                id: target.id
            })
            nameInput.on("change", () => emitSceneChange())
        }

        if (selectionTarget instanceof SimpleObjectManager) {
            const transformParams = {
                "scale": target.scale,
                "scale xyz": makeVectorXYZ("scale"),
                "position": makeVector("x", "y", "z"),
                "rotation": makeVectorXYZ("rotation")
            }
            addInputs(pane, "transform", target, transformParams, {
                "scale xyz": makeVectorNames("scale"),
                "position": ["x", "y", "z"],
                "rotation": makeVectorNames("rotation")
            })
            handle.watch(onTransformControls(() => {
                programmatic = true
                disableProgrammatic()

                Object.assign(transformParams, {
                    "scale xyz": makeVectorXYZ("scale"),
                    "position": makeVector("x", "y", "z"),
                    "rotation": makeVectorXYZ("rotation"),
                })
                pane.refresh()
            }))
        }
        else {
            const transformParams = {
                "position": makeVector("x", "y", "z")
            }
            addInputs(pane, "transform", target, transformParams, {
                "position": ["x", "y", "z"]
            })
            handle.watch(onTransformControls(() => {
                programmatic = true
                disableProgrammatic()

                Object.assign(transformParams, {
                    "position": makeVector("x", "y", "z")
                })
                pane.refresh()
            }))
        }

        if (selectionTarget instanceof ObjectManager)
            addInputs(pane, "inner transform", target, {
                "size": makeVector("width", "height", "depth"),
                "inner position": makeVectorXYZ("inner"),
                "inner rotation": makeVectorXYZ("innerRotation")
            }, {
                "size": ["width", "height", "depth"],
                "inner position": makeVectorNames("inner"),
                "inner rotation": makeVectorNames("innerRotation")
            })

        if (!multipleSelectionTargets.length) {
            if (selectionTarget instanceof SimpleObjectManager)
                addInputs(pane, "display", target, {
                    bloom: target.bloom,
                    reflection: target.reflection,
                    outline: target.outline,

                    visible: target.visible,
                    innerVisible: target.innerVisible,
                    frustumCulled: target.frustumCulled,

                    metalnessFactor: target.metalnessFactor,
                    roughnessFactor: target.roughnessFactor,
                    environmentFactor: target.environmentFactor,

                    toon: target.toon,
                    pbr: target.pbr
                })
            
            const { schema, componentName } = target.constructor

            const params: Record<string, any> = {}
            for (const [key, value] of Object.entries(schema)) {
                if (key in objectManagerSchema || value === Function) continue

                let v = target[key]
                if (v === Infinity)
                    v = 9999
                else if (v === -Infinity)
                    v = -9999
                else if (Array.isArray(v))
                    v = JSON.stringify(v)

                params[key] = v
            }

            if (schema === dummySchema) {
                params.stride = { x: 0, y: 0 }
                const { stride: strideInput } = addInputs(pane, componentName, target, params)
                strideInput.on("change", ({ value }) => {
                    Object.assign(params, {
                        "strideForward": -value.y,
                        "strideRight": value.x
                    })
                    pane.refresh()
                })
            }
            else addInputs(pane, componentName, target, params)
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