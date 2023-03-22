import { Pane } from "./tweakpane"
import addInputs from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { Cancellable } from "@lincode/promiselikes"
import Setup from "../../display/Setup"

export default (
    pane: Pane,
    targetSetup: Setup,
    includeKeys: Array<string> | undefined
) => {
    const handle = new Cancellable()
    const [params, manager] = createParams(targetSetup, includeKeys, true)
    const [editorParams, editorRest] = splitObject(params, ["grid", "stats"])
    addInputs(handle, pane, "editor", manager, editorParams)

    const [rendererParams, rendererRest] = splitObject(editorRest, [
        "antiAlias",
        "pixelRatio",
        "fps"
    ])
    addInputs(handle, pane, "renderer", manager, rendererParams)

    const [physicsParams, physicsRest] = splitObject(rendererRest, ["gravity"])
    addInputs(handle, pane, "physics", manager, physicsParams)

    const [sceneParams, sceneRest] = splitObject(physicsRest, [
        "exposure",
        "defaultLight",
        "environment",
        "skybox",
        "texture",
        "color",
        "shadowResolution",
        "shadowDistance"
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
