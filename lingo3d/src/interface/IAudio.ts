import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IAudio extends IPositioned {
    src: Nullable<string>
}

export const audioSchema: Required<ExtractProps<IAudio>> = {
    ...positionedSchema,
    src: String
}

export const audioDefaults: Defaults<IAudio> ={
    ...positionedDefaults,
    src: undefined
}