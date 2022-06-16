import settings from "../api/settings"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISetup extends Partial<typeof settings> {}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    performance: String,
    skybox: [String, Array],
    defaultLight: [String, Boolean],
    defaultLightScale: Number,
    defaultOrbitControls: Boolean,
    defaultFog: String,
    gridHelper: Boolean,
    gridHelperSize: Number,
    gravity: Number,
    repulsion: Number,
    autoMount: [Boolean, String],
    logarithmicDepth: Boolean,
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
    lensDistortion: Boolean,
    lensIor: Number,
    lensBand: Number,
    texture: String,
    color: String
}

export const setupDefaults: Defaults<ISetup> = {
    ...settings
}