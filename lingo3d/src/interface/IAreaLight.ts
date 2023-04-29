import IPlane, { planeDefaults, planeSchema } from "./IPlane"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { ExtractProps } from "./utils/extractProps"

export default interface IAreaLight extends IPlane {
    intensity: number
}

export const areaLightSchema: Required<ExtractProps<IAreaLight>> = {
    ...planeSchema,
    intensity: Number
}

export const areaLightDefaults = extendDefaults<IAreaLight>(
    [planeDefaults],
    {
        intensity: 1,
        emissive: true
    },
    { intensity: new Range(0, 10) },
    { color: true }
)
