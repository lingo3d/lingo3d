import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPlane extends IPrimitive {}

export const planeSchema: Required<ExtractProps<IPlane>> = {
    ...primitiveSchema
}

export const planeDefaults: Defaults<IPlane> = {
    ...primitiveDefaults,
    scaleZ: 0,
    depth: 0
}