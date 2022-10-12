import setupStruct from "../engine/setupStruct"
import { SHADOW_BIAS, SHADOW_DISTANCE } from "../globals"
import Choices from "./utils/Choices"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import NullableDefault from "./utils/NullableDefault"
import Options from "./utils/Options"
import Range from "./utils/Range"

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
    bloomIntensity: Number,
    bloomThreshold: Number,
    bloomRadius: Number,
    ssr: Boolean,
    ssrIntensity: Number,
    ssao: Boolean,
    ssaoIntensity: Number,
    outlineColor: String,
    outlineHiddenColor: String,
    outlinePattern: String,
    outlinePulse: Number,
    outlineStrength: Number,
    texture: String,
    color: String
}
hideSchema(["antiAlias", "pixelRatio", "gravity", "repulsion", "centripetal"])

export const setupOptions: Options<ISetup> = {
    defaultLight: new Choices({ true: true, false: false, studio: "studio" }),
    shadowDistance: new Range(1000, 5000),
    shadowResolution: new Range(512, 2048, 512),
    pixelRatio: new Range(1, 2, 1),
    fps: new Range(30, 60, 30),
    exposure: new Range(0, 10),
    bloomIntensity: new Range(0, 10),
    bloomThreshold: new Range(0, 1),
    bloomRadius: new Range(0, 1),
    ssrIntensity: new Range(0, 2),
    ssaoIntensity: new Range(0, 4),
    outlinePulse: new Range(0, 2),
    outlineStrength: new Range(0, 4),
    gravity: new Range(0, 20),
    repulsion: new Range(0, 10),
    antiAlias: new Choices({ MSAA: "MSAA", SMAA: "SMAA", false: false }),
    gridHelperSize: new Range(10, 1000, 10)
}

export const setupDefaults: Defaults<ISetup> = {
    ...setupStruct,
    shadowDistance: new NullableDefault(SHADOW_DISTANCE),
    shadowResolution: new NullableDefault(1024),
    shadowBias: new NullableDefault(SHADOW_BIAS)
}
