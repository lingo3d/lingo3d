import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { last, omit } from "@lincode/utils"
import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Camera } from "three"
import { Pane } from "tweakpane"
import background from "../api/background"
import rendering from "../api/rendering"
import settings from "../api/settings"
import mainCamera from "../engine/mainCamera"
import { getCamera, setCamera } from "../states/useCamera"
import { getCameraList } from "../states/useCameraList"
import { setEditor } from "../states/useEditor"
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

const addInputs = (pane: Pane, title: string, target: Record<string, any>, params: Record<string, any>) => {
    const folder = pane.addFolder({ title })

    for (const [key, value] of Object.entries(params))
        value === undefined && (params[key] = "")

    for (const key of Object.keys(params)) {
        const input = folder.addInput(params, key)
        input.on("change", e => target[key] = e.value)
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
        setEditor(false)
        this.effectHandle?.cancel()
    }
    
    protected override firstUpdated() {
        const container = this.containerRef.value
        if (!container) return

        const currentCamera = getCamera()

        this.effectHandle = createEffect(() => {
            setEditor(true)
            setCamera(mainCamera)
            setOrbitControls(true)
            setSelection(true)
            setGridHelper(true)

            const selectionTarget = getSelectionTarget()

            if (selectionTarget) {
                return
            }

            const pane = new Pane({ container })
            addCameraInput(pane, getCameraList())


            addInputs(pane, "settings", settings, omit(settings, [
                "pixelRatio",
                "performance",
                "wasmPath",
                "autoMount"
            ]))
            addInputs(pane, "background", background, background)
            addInputs(pane, "rendering", rendering, rendering)

            return () => {
                pane.dispose()

                setEditor(false)
                setCamera(currentCamera)
                setOrbitControls(false)
                setSelection(false)
                setGridHelper(false)
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