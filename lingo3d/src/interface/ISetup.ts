import { AmbientOcclusion } from "../states/useAmbientOcclusion"
import { DefaultLight } from "../states/useDefaultLight"
import { Encoding } from "../states/useEncoding"
import { PerformanceValue } from "../states/usePerformance"
import { ExtractProps } from "./utils/extractProps"

export default interface ISetup {
    performance?: PerformanceValue
    gridHelper?: boolean
    cameraHelper?: boolean
    lightHelper?: boolean
    defaultFog?: boolean
    defaultLight?: DefaultLight
    defaultLightScale?: number
    defaultOrbitControls?: boolean
    gravity?: number
    mapPhysics?: number
    wasmPath?: string
    logarithmicDepth?: boolean
    encoding?: Encoding
    exposure?: number
    pbr?: boolean
    selectiveBloom?: boolean
    bloom?: boolean
    bloomStrength?: number
    bloomRadius?: number
    bloomThreshold?: number
    bokeh?: boolean
    bokehFocus?: number
    bokehMaxBlur?: number
    bokehAperture?: number
    ambientOcclusion?: AmbientOcclusion
    outline?: boolean
    outlineColor?: string
    outlineHiddenColor?: string
    outlinePattern?: string
    outlinePulse?: number
    outlineStrength?: number
    outlineThickness?: number
    texture?: string
    skybox?: string
    color?: string
}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    performance: String,
    gridHelper: Boolean,
    cameraHelper: Boolean,
    lightHelper: Boolean,
    defaultFog: Boolean,
    defaultLight: [String, Boolean],
    defaultLightScale: Number,
    defaultOrbitControls: Boolean,
    gravity: Number,
    mapPhysics: Number,
    wasmPath: String,
    logarithmicDepth: Boolean,
    encoding: String,
    exposure: Number,
    pbr: Boolean,
    selectiveBloom: Boolean,
    bloom: Boolean,
    bloomStrength: Number,
    bloomRadius: Number,
    bloomThreshold: Number,
    bokeh: Boolean,
    bokehFocus: Number,
    bokehMaxBlur: Number,
    bokehAperture: Number,
    ambientOcclusion: [Boolean, String],
    outline: Boolean,
    outlineColor: String,
    outlineHiddenColor: String,
    outlinePattern: String,
    outlinePulse: Number,
    outlineStrength: Number,
    outlineThickness: Number,
    texture: String,
    skybox: String,
    color: String
}

export const setupDefaults: ISetup = {}