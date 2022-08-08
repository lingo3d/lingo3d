import setupStruct from "../engine/setupStruct"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

type Type = typeof setupStruct

export default interface ISetup extends Type {}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    skybox: [String, Array],
    defaultLight: [String, Boolean],
    gridHelper: Boolean,
    gridHelperSize: Number,
    gravity: Number,
    repulsion: Number,
    centripetal: Boolean,
    antiAlias: [Boolean, String],
    logarithmicDepth: Boolean,
    pixelRatio: Number,
    exposure: Number,
    pbr: Boolean,
    bloom: Boolean,
    bloomStrength: Number,
    bloomRadius: Number,
    bloomThreshold: Number,
    ambientOcclusion: [Boolean, String],
    outlineColor: String,
    outlineHiddenColor: String,
    outlinePattern: String,
    outlinePulse: Number,
    outlineStrength: Number,
    outlineThickness: Number,
    bokeh: Boolean,
    bokehAperture: Number,
    bokehFocus: Number,
    bokehMaxBlur: Number,
    lensDistortion: Boolean,
    lensIor: Number,
    lensBand: Number,
    motionBlur: Boolean,
    motionBlurStrength: Number,
    texture: String,
    color: String
}

export const setupDefaults: Defaults<ISetup> = {
    ...setupStruct
}
