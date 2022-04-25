import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Pane } from "tweakpane"
import mainCamera from "../engine/mainCamera"
import { container } from "../engine/renderLoop/renderSetup"
import { setupDefaults } from "../interface/ISetup"
import { setCamera } from "../states/useCamera"
import { setEditor } from "../states/useEditor"
import { setGridHelper } from "../states/useGridHelper"
import { setOrbitControls } from "../states/useOrbitControls"
import { setSelection } from "../states/useSelection"

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

        const PARAMS = { ...setupDefaults }
        PARAMS.defaultLight = "true"
        PARAMS.ambientOcclusion = "false" as any

        for (const [key, value] of Object.entries(PARAMS))
            if (value === undefined)
                //@ts-ignore
                PARAMS[key] = ""
          
        const pane = new Pane({ container })
        
        for (const key of Object.keys(PARAMS))
            pane.addInput(PARAMS, key as any)
        
        setTimeout(() => {
            setEditor(true)
            setCamera(mainCamera)
            setOrbitControls(true)
            setSelection(true)
            setGridHelper(true)
        })
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