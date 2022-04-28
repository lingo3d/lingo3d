import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { omit } from "@lincode/utils"
import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Camera } from "three"
import { Pane } from "tweakpane"
import background from "../api/background"
import rendering from "../api/rendering"
import settings from "../api/settings"
import mainCamera from "../engine/mainCamera"
import { onTransformControls } from "../events/onTransformControls"
import { objectManagerSchema } from "../interface/IObjectManager"
import { getCamera, setCamera } from "../states/useCamera"
import { getCameraList } from "../states/useCameraList"
import { setGridHelper } from "../states/useGridHelper"
import { setOrbitControls } from "../states/useOrbitControls"
import { setSelection } from "../states/useSelection"
import { getSelectionTarget } from "../states/useSelectionTarget"

const addCameraInput = (pane: Pane, camList: Array<Camera>) => {
    const cameraFolder = pane.addFolder({ title: "camera" })
    const cameraInput = pane.addInput({ "camera": 0 }, "camera", {
        options: camList.reduce<Record<string, any>>((acc, _, i) => (acc["camera " + i] = i, acc), {})
    })
    cameraFolder.add(cameraInput)
    cameraInput.on("change", e => setCamera(camList[e.value]))
}

const toFixed = (v: any) => typeof v === "number" ? Number(v.toFixed(2)) : v

let programmatic = false

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

    for (const key of Object.keys(params)) {
        const input = folder.addInput(params, key)
        input.on("change", e => {
            if (programmatic) {
                programmatic = false
                return
            }
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
    }
}

@customElement("lingo3d-editor")
export default class Editor extends LitElement {
    public constructor() {
        super()
        document.body.appendChild(this)
    }

    private containerRef: Ref<HTMLInputElement> = createRef()
    private effectHandle?: Cancellable

    public override disconnectedCallback() {
        super.disconnectedCallback()
        this.effectHandle?.cancel()
    }
    
    protected override firstUpdated() {
        const container = this.containerRef.value
        if (!container) return

        const currentCamera = getCamera()

        this.effectHandle = createEffect(() => {
            setCamera(mainCamera)
            setOrbitControls(true)
            setSelection(true)
            setGridHelper(true)

            const target: any = getSelectionTarget()
            const pane = new Pane({ container })

            const handle = new Cancellable(() => {
                pane.dispose()
    
                setCamera(currentCamera)
                setOrbitControls(false)
                setSelection(false)
                setGridHelper(false)
            })

            if (target) {
                addCameraInput(pane, getCameraList())

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
                    Object.assign(transformParams, {
                        "scale xyz": makeVectorXYZ("scale"),
                        "position": makeVector("x", "y", "z"),
                        "rotation": makeVectorXYZ("rotation"),
                    })
                    pane.refresh()
                }))

                addInputs(pane, "inner transform", target, {
                    "size": makeVector("width", "height", "depth"),
                    "inner position": makeVectorXYZ("inner"),
                    "inner rotation": makeVectorXYZ("innerRotation")
                }, {
                    "size": ["width", "height", "depth"],
                    "inner position": makeVectorNames("inner"),
                    "inner rotation": makeVectorNames("innerRotation")
                })

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
                    params[key] = target[key]
                }
                addInputs(pane, componentName, target, params)

                return () => {
                    handle.cancel()
                }
            }

            addCameraInput(pane, getCameraList())

            addInputs(pane, "settings", settings, omit(settings, [
                "pixelRatio",
                "performance",
                "wasmPath",
                "autoMount"
            ]))
            addInputs(pane, "background", background)
            addInputs(pane, "rendering", rendering)

            return () => {
                handle.cancel()
            }
        }, [getCameraList, getSelectionTarget])
    }

    protected override createRenderRoot() {
        return this
    }

    protected override render() {
        return html`
            <div
             ref=${ref(this.containerRef)}
             style="user-select:none; position: absolute; left: 0px; top: 0px; width: 350px; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 10"
            />
        `
    }
}