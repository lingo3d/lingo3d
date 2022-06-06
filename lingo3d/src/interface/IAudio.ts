import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import { ExtractProps } from "./utils/extractProps"

export default interface IAudio extends IPositioned {
    src?: string
}

export const audioSchema: Required<ExtractProps<IAudio>> = {
    ...positionedSchema,
    src: String
}

export const audioDefaults: IAudio ={
    ...positionedDefaults,
}