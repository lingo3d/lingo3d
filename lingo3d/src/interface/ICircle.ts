import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ICircle extends IPrimitive {}

export const circleSchema: Required<ExtractProps<ICircle>> = {
    ...primitiveSchema
}

export const circleDefaults = extendDefaults<ICircle>([primitiveDefaults], {
    scaleZ: 0,
    depth: 0
})
