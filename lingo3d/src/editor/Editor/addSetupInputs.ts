import { Pane } from "./tweakpane"
import { setupDefaults } from "../../interface/ISetup"
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
    const [editorParams, editorRest] = splitObject(params, [
        "gridHelper",
        "gridHelperSize",
        "stats"
    ])
    addInputs(handle, pane, "editor", manager, setupDefaults, editorParams)

    const [rendererParams, rendererRest] = splitObject(editorRest, [
        "antiAlias",
        "pixelRatio",
        "fps",
        "logarithmicDepth",
        "uiLayer",
        "pbr"
    ])
    addInputs(handle, pane, "renderer", manager, setupDefaults, rendererParams)

    const [sceneParams, sceneRest] = splitObject(rendererRest, [
        "exposure",
        "defaultLight",
        "preset environment",
        "environment",
        "skybox",
        "texture",
        "color",
        "shadowResolution",
        "shadowDistance"
    ])
    addInputs(
        handle,
        pane,
        "lighting & environment",
        manager,
        setupDefaults,
        sceneParams
    )

    const [effectsParams, effectsRest] = splitObject(sceneRest, [
        "bloom",
        "bloomIntensity",
        "bloomThreshold",
        "bloomRadius",
        "ssr",
        "ssrIntensity",
        "ssao",
        "ssaoIntensity",
        "bokeh",
        "bokehScale",
        "vignette"
    ])
    addInputs(handle, pane, "effects", manager, setupDefaults, effectsParams)

    const [outlineParams, outlineRest] = splitObject(effectsRest, [
        "outlineColor",
        "outlineHiddenColor",
        "outlinePattern",
        "outlinePulse",
        "outlineStrength"
    ])
    addInputs(
        handle,
        pane,
        "outline effect",
        manager,
        setupDefaults,
        outlineParams
    )

    Object.keys(outlineRest).length &&
        addInputs(handle, pane, "settings", manager, setupDefaults, outlineRest)

    return handle
}
