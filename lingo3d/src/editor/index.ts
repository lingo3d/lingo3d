import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import { createRef, ref, Ref } from "lit/directives/ref.js"
import { Pane } from "tweakpane"
import mainCamera from "../engine/mainCamera"
import ISetup, { setupDefaults } from "../interface/ISetup"
import { setCamera } from "../states/useCamera"
import { setEditor } from "../states/useEditor"
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
            gravity: setupDefaults.gravity,
            mapPhysics: setupDefaults.mapPhysics,
            wasmPath: setupDefaults.wasmPath,
            autoMount: setupDefaults.autoMount,
            logarithmicDepth: setupDefaults.logarithmicDepth,
            encoding: setupDefaults.encoding,
            exposure: setupDefaults.exposure,
            pbr: setupDefaults.pbr,
            selectiveBloom: setupDefaults.selectiveBloom,
            bloom: setupDefaults.bloom,
            bloomStrength: setupDefaults.bloomStrength,
            bloomRadius: setupDefaults.bloomRadius,
            bloomThreshold: setupDefaults.bloomThreshold,
            bokeh: setupDefaults.bokeh,
            bokehFocus: setupDefaults.bokehFocus,
            bokehMaxBlur: setupDefaults.bokehMaxBlur,
            bokehAperture: setupDefaults.bokehAperture,
            ambientOcclusion: "false" as any,
            outline: setupDefaults.outline,
            outlineColor: setupDefaults.outlineColor,
            outlineHiddenColor: setupDefaults.outlineHiddenColor,
            outlinePattern: setupDefaults.outlinePattern,
            outlinePulse: setupDefaults.outlinePulse,
            outlineStrength: setupDefaults.outlineStrength,
            outlineThickness: setupDefaults.outlineThickness,
            texture: setupDefaults.texture,
            skybox: "",
            color: setupDefaults.color,
        }
          
        const pane = new Pane({ container })
        
        pane.addInput(PARAMS, "defaultFog")
        pane.addInput(PARAMS, "defaultLight")
        pane.addInput(PARAMS, "defaultLightScale")
        pane.addInput(PARAMS, "defaultFog")
        pane.addInput(PARAMS, "defaultLight")
        pane.addInput(PARAMS, "defaultLightScale")
        pane.addInput(PARAMS, "gravity")
        pane.addInput(PARAMS, "mapPhysics")
        pane.addInput(PARAMS, "wasmPath")
        pane.addInput(PARAMS, "autoMount")
        pane.addInput(PARAMS, "logarithmicDepth")
        pane.addInput(PARAMS, "encoding")
        pane.addInput(PARAMS, "exposure")
        pane.addInput(PARAMS, "pbr")
        pane.addInput(PARAMS, "selectiveBloom")
        pane.addInput(PARAMS, "bloom")
        pane.addInput(PARAMS, "bloomStrength")
        pane.addInput(PARAMS, "bloomRadius")
        pane.addInput(PARAMS, "bloomThreshold")
        pane.addInput(PARAMS, "bokeh")
        pane.addInput(PARAMS, "bokehFocus")
        pane.addInput(PARAMS, "bokehMaxBlur")
        pane.addInput(PARAMS, "bokehAperture")
        pane.addInput(PARAMS, "ambientOcclusion")

        // pane.addInput(PARAMS, "texture")
        pane.addInput(PARAMS, "skybox")
        // pane.addInput(PARAMS, "color")
        
        pane.addInput(PARAMS, "outline")
        pane.addInput(PARAMS, "outlineColor")
        // pane.addInput(PARAMS, "outlineHiddenColor")
        // pane.addInput(PARAMS, "outlinePattern")
        pane.addInput(PARAMS, "outlinePulse")
        pane.addInput(PARAMS, "outlineStrength")
        pane.addInput(PARAMS, "outlineThickness")
        

        setEditor(true)
        setCamera(mainCamera)
        setOrbitControls(true)
        setSelection(true)
        setGridHelper(true)
    }
    
    public override disconnectedCallback(): void {
        setEditor(false)
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