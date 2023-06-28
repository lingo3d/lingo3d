import setupStruct from "../api/settings/setupStruct"
import { disableSchema } from "../collections/disableSchema"
import { environmentChoices } from "./IEnvironment"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

type Type = typeof setupStruct

export default interface ISetup extends Type {
    uuid: string
}

export const setupSchema: Required<ExtractProps<ISetup>> = {
    uuid: String,
    defaultLight: Boolean,
    lightDistance: Number,
    pointLightPool: Number,
    spotLightPool: Number,
    environment: String,
    skybox: [String, Array],
    grid: Boolean,
    stats: Boolean,
    fps: Number,
    gravity: Number,
    exposure: Number,
    bloom: Boolean,
    bloomIntensity: Number,
    bloomThreshold: Number,
    bloomRadius: Number,
    ssr: Boolean,
    ssrIntensity: Number,
    ssrJitter: Number,
    ssao: Boolean,
    ssaoIntensity: Number,
    ssaoRadius: Number,
    outlineColor: String,
    outlineHiddenColor: String,
    outlinePattern: String,
    outlinePulse: Number,
    outlineStrength: Number,
    bokeh: Boolean,
    bokehScale: Number,
    vignette: Boolean,
    texture: String,
    color: String
}
disableSchema.add("grid")
disableSchema.add("stats")

export const setupDefaults = extendDefaults<ISetup>(
    [],
    { ...setupStruct, uuid: "" },
    {
        lightDistance: new Range(500, 5000),
        pointLightPool: new Range(1, 10, 1),
        spotLightPool: new Range(1, 10, 1),
        environment: environmentChoices,
        fps: new Range(30, 60, 30),
        gravity: new Range(-20, 0),
        exposure: new Range(0, 2),
        bokehScale: new Range(0, 20),
        bloomIntensity: new Range(0, 10),
        bloomThreshold: new Range(0, 1),
        bloomRadius: new Range(0, 1),
        ssrIntensity: new Range(0, 2),
        ssrJitter: new Range(0, 1),
        ssaoIntensity: new Range(0, 2),
        ssaoRadius: new Range(0, 2),
        outlinePulse: new Range(0, 2),
        outlineStrength: new Range(0, 4)
    }
)
