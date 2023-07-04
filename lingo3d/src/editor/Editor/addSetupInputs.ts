import { Pane } from "./tweakpane"
import addInputs from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { Cancellable } from "@lincode/promiselikes"
import { defaultSetupPtr } from "../../pointers/defaultSetupPtr"

export default (pane: Pane, includeKeys: Array<string> | undefined) => {
    const [targetSetup] = defaultSetupPtr
    if (!targetSetup) return

    const handle = new Cancellable()
    const manager = targetSetup
    const params = createParams(targetSetup, includeKeys)

    const [rendererParams, rendererRest] = splitObject(params, ["fps"])
    addInputs(handle, pane, "renderer", manager, rendererParams)

    const [physicsParams, physicsRest] = splitObject(rendererRest, ["gravity"])
    addInputs(handle, pane, "physics", manager, physicsParams)

    const [sceneParams, sceneRest] = splitObject(physicsRest, [
        "exposure",
        "defaultLight",
        "lightDistance",
        "pointLightPool",
        "spotLightPool",
        "environment",
        "skybox",
        "texture",
        "color"
    ])
    addInputs(handle, pane, "lighting & environment", manager, sceneParams)

    const [effectsParams, effectsRest] = splitObject(sceneRest, [
        "bloom",
        "bloomIntensity",
        "bloomThreshold",
        "bloomRadius",
        "ssr",
        "ssrIntensity",
        "ssrJitter",
        "ssao",
        "ssaoIntensity",
        "ssaoRadius",
        "bokeh",
        "bokehScale",
        "vignette"
    ])
    addInputs(handle, pane, "effects", manager, effectsParams)

    const [outlineParams, outlineRest] = splitObject(effectsRest, [
        "outlineColor",
        "outlineHiddenColor",
        "outlinePattern",
        "outlinePulse",
        "outlineStrength"
    ])
    addInputs(handle, pane, "outline effect", manager, outlineParams)

    Object.keys(outlineRest).length &&
        addInputs(handle, pane, "settings", manager, outlineRest)

    return handle
}
