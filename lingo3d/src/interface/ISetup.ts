import settings from "../api/settings"
import { ExtractProps } from "./utils/extractProps"

type Settings = typeof settings

export default interface ISetup extends Settings {}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    pixelRatio: Number,
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
    wasmPath: String,
    autoMount: [Boolean, String],
    logarithmicDepth: Boolean,
    encoding: String,
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
    lensIOR: Number,
    lensBand: Number,
    texture: String,
    color: String
}

export const setupDefaults: ISetup = {
    ...settings
}