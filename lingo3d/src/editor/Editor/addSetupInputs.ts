import { Pane } from "./tweakpane"
import ISetup, { setupSchema, setupDefaults } from "../../interface/ISetup"
import addInputs from "./addInputs"
import createParams from "./createParams"
import splitObject from "./splitObject"
import { Cancellable } from "@lincode/promiselikes"

export default (
    handle: Cancellable,
    pane: Pane,
    targetSetup: Partial<ISetup>,
    includeKeys: Array<string> | undefined
) => {
    const [editorParams, editorRest] = splitObject(
        createParams(setupSchema, setupDefaults, targetSetup, includeKeys),
        ["gridHelper", "gridHelperSize", "stats"]
    )
    addInputs(handle, pane, "editor", targetSetup, setupDefaults, editorParams)

    const [rendererParams, rendererRest] = splitObject(editorRest, [
        "antiAlias",
        "pixelRatio",
        "fps",
        "logarithmicDepth",
        "uiLayer",
        "pbr"
    ])
    addInputs(
        handle,
        pane,
        "renderer",
        targetSetup,
        setupDefaults,
        rendererParams
    )

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
        targetSetup,
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
    addInputs(
        handle,
        pane,
        "effects",
        targetSetup,
        setupDefaults,
        effectsParams
    )

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
        targetSetup,
        setupDefaults,
        outlineParams
    )

    Object.keys(outlineRest).length &&
        addInputs(
            handle,
            pane,
            "settings",
            targetSetup,
            setupDefaults,
            outlineRest
        )
}
