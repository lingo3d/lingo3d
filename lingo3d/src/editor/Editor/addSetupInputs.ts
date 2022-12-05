import { Pane } from "../TweakPane/tweakpane"
import ISetup, { setupSchema, setupDefaults } from "../../interface/ISetup"
import addInputs from "./addInputs"
import getParams from "./getParams"
import splitObject from "./splitObject"
import { Cancellable } from "@lincode/promiselikes"

export default (
    handle: Cancellable,
    pane: Pane,
    targetSetup: Partial<ISetup>
) => {
    const [editorParams, editorRest] = splitObject(
        getParams(setupSchema, setupDefaults, targetSetup),
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
        "environment",
        "skybox",
        "texture",
        "color",
        "defaultShadow",
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

    const [physicsParams, physicsRest] = splitObject(outlineRest, [
        "gravity",
        "repulsion",
        "centripetal"
    ])
    addInputs(
        handle,
        pane,
        "physics",
        targetSetup,
        setupDefaults,
        physicsParams
    )

    Object.keys(physicsRest).length &&
        addInputs(
            handle,
            pane,
            "settings",
            targetSetup,
            setupDefaults,
            physicsRest
        )
}
