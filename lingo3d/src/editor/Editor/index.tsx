import { debounce, omit, preventTreeShake } from "@lincode/utils"
import { PerspectiveCamera } from "three"
import { Pane } from "tweakpane"
import background from "../../api/background"
import rendering from "../../api/rendering"
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
import { useEffect, useRef } from "preact/hooks"
import register from "preact-custom-element"
import { useSelectionTarget, useCameraList } from "../states"
import SimpleObjectManager from "../../display/core/SimpleObjectManager"
import ObjectManager from "../../display/core/ObjectManager"
import { Cancellable } from "@lincode/promiselikes"
import { setSelectionTarget } from "../../states/useSelectionTarget"
import { emitSceneChange } from "../../events/onSceneChange"
import { getSecondaryCamera, setSecondaryCamera } from "../../states/useSecondaryCamera"

preventTreeShake(h)

const addCameraInput = (pane: Pane, camList: Array<PerspectiveCamera>) => {
    const cameraFolder = pane.addFolder({ title: "camera" })

    const options = camList.reduce<Record<string, any>>((acc, _, i) => (acc["camera " + i] = i, acc), {})
    const cameraInput = pane.addInput(
        { "camera": camList.indexOf(getCamera()) },
        "camera",
        { options }
    )
    cameraFolder.add(cameraInput)
    cameraInput.on("change", e => setCamera(camList[e.value]))

    const secondaryOptions: any = { none: 0, ...omit(options, "camera 0") }
    const secondaryCameraInput = pane.addInput(
        { "secondary camera": camList.indexOf(getSecondaryCamera() ?? mainCamera) },
        "secondary camera",
        { options: secondaryOptions }
    )
    cameraFolder.add(secondaryCameraInput)
    secondaryCameraInput.on("change", e => setSecondaryCamera(e.value === 0 ? undefined : camList[e.value]))
}

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
                typeof value?.x === "number" && (value.x = toFixed(value.x))
                typeof value?.y === "number" && (value.y = toFixed(value.y))
                typeof value?.z === "number" && (value.z = toFixed(value.z))
                break
        }

    return Object.keys(params).map(key => {
        const input = folder.addInput(params, key)
        input.on("change", e => {
            if (programmatic) return
            
            if (vectorMap?.[key]) {
                const [xProp, yProp, zProp] = vectorMap[key]
                const { x, y, z } = e.value
                target[xProp] = toFixed(x)
                target[yProp] = toFixed(y)
                target[zProp] = toFixed(z)
                return
            }

            if (typeof e.value === "string") {
                if (e.value === "true" || e.value === "false") {
                    target[key] = e.value === "true" ? true : false
                    return
                }
                const num = parseFloat(e.value)
                if (!Number.isNaN(num)) {
                    target[key] = num
                    return
                }
            }
            target[key] = toFixed(e.value)
        })
        return input
    })
}

interface EditorProps {
    blockKeyboard?: string
    blockMouse?: string
}

const Editor = ({ blockKeyboard, blockMouse }: EditorProps) => {
    const elRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setSelectionBlockKeyboard(blockKeyboard === "false" ? false : true)
        setSelectionBlockMouse(blockMouse === "false" ? false : true)
    }, [blockKeyboard, blockMouse])

    useEffect(() => {
        const currentCamera = getCamera()

        setCamera(mainCamera)
        setOrbitControls(true)
        setSelection(true)
        setGridHelper(true)
        
        return () => {
            setCamera(currentCamera)
            setOrbitControls(false)
            setSelection(false)
            setGridHelper(false)
        }
    }, [])

    const [selectionTarget] = useSelectionTarget()
    const [cameraList] = useCameraList()

    useEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })

        if (!selectionTarget) {
            addCameraInput(pane, cameraList)

            addInputs(pane, "settings", settings, omit(settings, [
                "pixelRatio",
                "performance",
                "wasmPath",
                "autoMount"
            ]))
            addInputs(pane, "background", background)
            addInputs(pane, "rendering", rendering)

            return () => {
                pane.dispose()
            }
        }

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                selectionTarget.dispose()
                setSelectionTarget(undefined)
            }
        }
        document.addEventListener("keyup", handleKey)

        addCameraInput(pane, cameraList)

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

        const [nameInput] = addInputs(pane, "general", target, {
            name: target.name,
            id: target.id
        })
        nameInput.on("change", () => emitSceneChange())

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
        addInputs(pane, componentName, target, params)

        return () => {
            handle.cancel()
            pane.dispose()
            document.removeEventListener("keyup", handleKey)
        }
    }, [selectionTarget, cameraList])

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

register(Editor, "lingo3d-editor", ["blockKeyboard", "blockMouse"])