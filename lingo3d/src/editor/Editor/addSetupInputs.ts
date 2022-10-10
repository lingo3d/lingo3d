import { omit } from "@lincode/utils"
import { Pane } from "tweakpane"
import { nonEditorSettings } from "../../api/serializer/types"
import ISetup, { setupSchema, setupDefaults } from "../../interface/ISetup"
import addInputs from "./addInputs"
import getParams from "./getParams"
import splitObject from "./splitObject"

export default (pane: Pane, targetSetup: Partial<ISetup>) => {
    const [editorParams, editorRest] = splitObject(
        omit(
            getParams(setupSchema, setupDefaults, targetSetup),
            nonEditorSettings
        ),
        ["gridHelper", "gridHelperSize"]
    )
    addInputs(pane, "editor", targetSetup, setupDefaults, editorParams)

    const [rendererParams, rendererRest] = splitObject(editorRest, [
        "antiAlias",
        "pixelRatio",
        "fps",
        "logarithmicDepth",
        "pbr"
    ])
    addInputs(pane, "renderer", targetSetup, setupDefaults, rendererParams)

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
        "ssaoIntensity"
    ])
    addInputs(pane, "effects", targetSetup, setupDefaults, effectsParams)

    const [outlineParams, outlineRest] = splitObject(effectsRest, [
        "outlineColor",
        "outlineHiddenColor",
        "outlinePattern",
        "outlinePulse",
        "outlineStrength"
    ])
    addInputs(pane, "outline effect", targetSetup, setupDefaults, outlineParams)

    const [physicsParams, physicsRest] = splitObject(outlineRest, [
        "gravity",
        "repulsion",
        "centripetal"
    ])
    addInputs(pane, "physics", targetSetup, setupDefaults, physicsParams)

    Object.keys(physicsRest).length &&
        addInputs(pane, "settings", targetSetup, setupDefaults, physicsRest)
}
