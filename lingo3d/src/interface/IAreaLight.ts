import IPlane, { planeDefaults, planeSchema } from "./IPlane"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { ExtractProps } from "./utils/extractProps"

export default interface IAreaLight extends IPlane {
    intensity: number
    enabled: boolean
}

export const areaLightSchema: Required<ExtractProps<IAreaLight>> = {
    ...planeSchema,
    intensity: Number,
    enabled: Boolean
}

export const areaLightDefaults = extendDefaults<IAreaLight>(
    [planeDefaults],
    {
        intensity: 1,
        enabled: true,
        castShadow: false,
        emissive: true
    },
    { intensity: new Range(0, 10) },
    { color: true }
)
