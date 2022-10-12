import { Pane } from "tweakpane"
import ISetup, {
    setupSchema,
    setupDefaults,
    setupOptions
} from "../../interface/ISetup"
import addInputs from "./addInputs"
import getParams from "./getParams"
import splitObject from "./splitObject"

export default (pane: Pane, targetSetup: Partial<ISetup>) => {
    const [editorParams, editorRest] = splitObject(
        getParams(setupSchema, setupDefaults, targetSetup),
        ["gridHelper", "gridHelperSize"]
    )
    addInputs(
        pane,
        "editor",
        targetSetup,
        setupDefaults,
        editorParams,
        setupOptions
    )

    const [rendererParams, rendererRest] = splitObject(editorRest, [
        "antiAlias",
        "pixelRatio",
        "fps",
        "logarithmicDepth",
        "pbr"
    ])
    addInputs(
        pane,
        "renderer",
        targetSetup,
        setupDefaults,
        rendererParams,
        setupOptions
    )

    const [sceneParams, sceneRest] = splitObject(rendererRest, [
        "exposure",
        "defaultLight",
        "shadowDistance",
        "shadowResolution",
        "shadowBias",
        "skybox",
        "texture",
        "color"
    ])
    addInputs(
        pane,
        "lighting & environment",
        targetSetup,
        setupDefaults,
        sceneParams,
        setupOptions
    )

    const [effectsParams, effectsRest] = splitObject(sceneRest, [
        "bloom",
        "bloomIntensity",
        "bloomThreshold",
        "bloomRadius",
        "ssr",
        "ssrIntensity",
        "ssao",
        "ssaoIntensity"
    ])
    addInputs(
        pane,
        "effects",
        targetSetup,
        setupDefaults,
        effectsParams,
        setupOptions
    )

    const [outlineParams, outlineRest] = splitObject(effectsRest, [
        "outlineColor",
        "outlineHiddenColor",
        "outlinePattern",
        "outlinePulse",
        "outlineStrength"
    ])
    addInputs(
        pane,
        "outline effect",
        targetSetup,
        setupDefaults,
        outlineParams,
        setupOptions
    )

    const [physicsParams, physicsRest] = splitObject(outlineRest, [
        "gravity",
        "repulsion",
        "centripetal"
    ])
    addInputs(
        pane,
        "physics",
        targetSetup,
        setupDefaults,
        physicsParams,
        setupOptions
    )

    Object.keys(physicsRest).length &&
        addInputs(
            pane,
            "settings",
            targetSetup,
            setupDefaults,
            physicsRest,
            setupOptions
        )
}
