import { Pane } from "tweakpane"
import { defaultSSROptions } from "./SSROptions"

export class SSRDebugGUI {
    constructor(ssrEffect, params = defaultSSROptions) {
        const pane = new Pane()
        this.pane = pane
        pane.containerElem_.style.userSelect = "none"
        pane.containerElem_.style.width = "380px"

        pane.on("change", (ev) => {
            const { presetKey } = ev

            ssrEffect[presetKey] = ev.value
        })

        const generalFolder = pane.addFolder({ title: "General" })
        generalFolder.addInput(params, "intensity", {
            min: 0,
            max: 3,
            step: 0.01
        })
        generalFolder.addInput(params, "exponent", {
            min: 0.125,
            max: 8,
            step: 0.125
        })
        generalFolder.addInput(params, "distance", {
            min: 0.001,
            max: 20,
            step: 0.1
        })
        generalFolder.addInput(params, "fade", {
            min: 0,
            max: 20,
            step: 0.01
        })
        generalFolder.addInput(params, "roughnessFade", {
            min: 0,
            max: 1,
            step: 0.01
        })
        generalFolder.addInput(params, "thickness", {
            min: 0,
            max: 10,
            step: 0.01
        })
        generalFolder.addInput(params, "ior", {
            min: 1,
            max: 2.33333,
            step: 0.01
        })

        const maximumValuesFolder = pane.addFolder({ title: "Maximum Values" })
        maximumValuesFolder.addInput(params, "maxRoughness", {
            min: 0,
            max: 1,
            step: 0.01
        })
        maximumValuesFolder.addInput(params, "maxDepthDifference", {
            min: 0,
            max: 100,
            step: 0.1
        })

        const temporalResolveFolder = pane.addFolder({
            title: "Temporal Resolve"
        })

        temporalResolveFolder.addInput(params, "blend", {
            min: 0,
            max: 1,
            step: 0.001
        })
        temporalResolveFolder.addInput(params, "correction", {
            min: 0,
            max: 1,
            step: 0.0001
        })
        temporalResolveFolder.addInput(params, "correctionRadius", {
            min: 1,
            max: 4,
            step: 1
        })

        const blurFolder = pane.addFolder({ title: "Blur" })
        blurFolder.addInput(params, "blur", { min: 0, max: 1, step: 0.01 })
        blurFolder.addInput(params, "blurKernel", { min: 0, max: 5, step: 1 })
        blurFolder.addInput(params, "blurSharpness", {
            min: 0,
            max: 100,
            step: 1
        })

        const jitterFolder = pane.addFolder({ title: "Jitter" })

        jitterFolder.addInput(params, "jitter", { min: 0, max: 4, step: 0.01 })
        jitterFolder.addInput(params, "jitterRoughness", {
            min: 0,
            max: 4,
            step: 0.01
        })

        const definesFolder = pane.addFolder({ title: "Tracing" })

        definesFolder.addInput(params, "steps", { min: 1, max: 256, step: 1 })
        definesFolder.addInput(params, "refineSteps", {
            min: 0,
            max: 16,
            step: 1
        })
        definesFolder.addInput(params, "missedRays")

        const resolutionFolder = pane.addFolder({
            title: "Resolution",
            expanded: false
        })
        resolutionFolder.addInput(params, "resolutionScale", {
            min: 0.125,
            max: 1,
            step: 0.125
        })
        resolutionFolder.addInput(params, "velocityResolutionScale", {
            min: 0.125,
            max: 1,
            step: 0.125
        })
    }
}
