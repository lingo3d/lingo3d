import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IPlane extends IPrimitive {}

export const planeSchema: Required<ExtractProps<IPlane>> = {
    ...primitiveSchema
}

export const planeDefaults = extendDefaults<IPlane>([primitiveDefaults], {
    scaleZ: 0,
    depth: 0
})
