import setupStruct from "../engine/setupStruct"
import { SHADOW_BIAS, SHADOW_DISTANCE } from "../globals"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import NullableDefault from "./utils/NullableDefault"

type Type = typeof setupStruct

export default interface ISetup extends Type {}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    skybox: [String, Array],
    defaultLight: [String, Boolean],
    shadowDistance: Number,
    shadowResolution: Number,
    shadowBias: Number,
    gridHelper: Boolean,
    gridHelperSize: Number,
    gravity: Number,
    repulsion: Number,
    centripetal: Boolean,
    antiAlias: [Boolean, String],
    logarithmicDepth: Boolean,
    pixelRatio: Number,
    fps: Number,
    exposure: Number,
    pbr: Boolean,
    bloom: Boolean,
    bloomStrength: Number,
    bloomThreshold: Number,
    ssr: Boolean,
    ssrIntensity: Number,
    ambientOcclusion: [Boolean, String],
    outlineColor: String,
    outlineHiddenColor: String,
    outlinePattern: String,
    outlinePulse: Number,
    outlineStrength: Number,
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
    ...setupStruct,
    shadowDistance: new NullableDefault(SHADOW_DISTANCE),
    shadowResolution: new NullableDefault(1024),
    shadowBias: new NullableDefault(SHADOW_BIAS)
}
