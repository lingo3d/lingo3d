import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Pane } from "tweakpane"
import mainCamera from "../engine/mainCamera"
import ISetup, { setupDefaults } from "../interface/ISetup"
import { setCamera } from "../states/useCamera"
import { setGridHelper } from "../states/useGridHelper"
import { setOrbitControls } from "../states/useOrbitControls"
import { setSelection } from "../states/useSelection"

@customElement("lingo3d-editor")
export default class Editor extends LitElement {
    private containerRef: Ref<HTMLInputElement> = createRef()

    protected override firstUpdated() {
        const container = this.containerRef.value
        if (!container) return

        const PARAMS: Partial<ISetup> = {
            defaultFog: setupDefaults.defaultFog,
            defaultLight: "true",
            defaultLightScale: setupDefaults.defaultLightScale,
        }
          
        const pane = new Pane({ container })
        
        pane.addInput(PARAMS, "defaultFog")
        pane.addInput(PARAMS, "defaultLight")
        pane.addInput(PARAMS, "defaultLightScale")

        setCamera(mainCamera)
        setOrbitControls(true)
        setSelection(true)
        setGridHelper(true)
    }

    protected override createRenderRoot() {
        return this
    }

    protected override render() {
        return html`
            <div ref=${ref(this.containerRef)} style="user-select:none; position: absolute; left: 0px; top: 0px; z-index: 10;" />
        `
    }
}