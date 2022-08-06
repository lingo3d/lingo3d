import settings from "../api/settings"
import IEventLoop, { eventLoopDefaults, eventLoopSchema } from "./IEventLoop"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISetup extends IEventLoop, Partial<typeof settings> {}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    ...eventLoopSchema,
    skybox: [String, Array],
    defaultLight: [String, Boolean],
    defaultLightScale: Number,
    gridHelper: Boolean,
    gridHelperSize: Number,
    gravity: Number,
    repulsion: Number,
    centripetal: Boolean,
    autoMount: [Boolean, String],
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
    ...eventLoopDefaults,
    ...settings
}
