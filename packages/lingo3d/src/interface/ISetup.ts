import background from "../api/background"
import rendering from "../api/rendering"
import settings from "../api/settings"
import { ExtractProps } from "./utils/extractProps"

type Rendering = typeof rendering
type Settings = typeof settings
type Background = typeof background

export default interface ISetup extends Rendering, Settings, Background {}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    pixelRatio: Number,
    performance: String,
    defaultFog: String,
    defaultLight: [String, Boolean],
    defaultLightScale: Number,
    defaultOrbitControls: Boolean,
    gravity: Number,
    repulsion: Number,
    wasmPath: String,
    autoMount: Boolean,
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
    texture: String,
    skybox: [String, Array],
    color: String
}

export const setupDefaults: ISetup = {
    ...rendering,
    ...settings,
    ...background
}