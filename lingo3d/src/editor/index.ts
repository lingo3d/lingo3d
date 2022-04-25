import { createEffect } from "@lincode/reactivity"
import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Camera } from "three"
import { Pane } from "tweakpane"
import background from "../api/background"
import rendering from "../api/rendering"
import settings from "../api/settings"
import mainCamera from "../engine/mainCamera"
import { setCamera } from "../states/useCamera"
import { getCameraList } from "../states/useCameraList"
import { setEditor } from "../states/useEditor"
import { setGridHelper } from "../states/useGridHelper"
import { setOrbitControls } from "../states/useOrbitControls"
import { setSelection } from "../states/useSelection"

const addCameraInput = (pane: Pane, camList: Array<Camera>) => {
    const cameraFolder = pane.addFolder({ title: "camera" })
    const cameraInput = pane.addInput({ "camera": 0 }, "camera", {
        options: camList.reduce<Record<string, any>>((acc, _, i) => (acc["camera " + i] = i, acc), {})
    })
    cameraFolder.add(cameraInput)
    cameraInput.on("change", e => setCamera(camList[e.value]))
}

@customElement("lingo3d-editor")
export default class Editor extends LitElement {
    public constructor() {
        super()
        document.body.appendChild(this)
        console.log(this)
    }

    private containerRef: Ref<HTMLInputElement> = createRef()

    protected override firstUpdated() {
        const container = this.containerRef.value
        if (!container) return

        createEffect(() => {
            const PARAMS = { ...settings, ...rendering, ...background }
            PARAMS.defaultLight = "true"
            PARAMS.ambientOcclusion = "false" as any

            for (const [key, value] of Object.entries(PARAMS))
                if (value === undefined)
                    //@ts-ignore
                    PARAMS[key] = ""
            
            const pane = new Pane({ container })
            addCameraInput(pane, getCameraList())

            for (const key of Object.keys(PARAMS))
                pane.addInput(PARAMS, key as any)
            
            setEditor(true)
            setCamera(mainCamera)
            setOrbitControls(true)
            setSelection(true)
            setGridHelper(true)

            return () => {
                pane.dispose()
            }
        }, [getCameraList])
    }
    
    public override disconnectedCallback(): void {
        setEditor(false)
    }

    protected override createRenderRoot() {
        return this
    }

    protected override render() {
        return html`
            <div
             ref=${ref(this.containerRef)}
             style="user-select:none; position: absolute; left: 0px; top: 0px; height: 100%; overflow-x: hidden; overflow-y: scroll; z-index: 10"
            />
        `
    }
}