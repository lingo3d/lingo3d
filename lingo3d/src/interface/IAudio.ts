import IPositioned, { positionedDefaults, positionedSchema } from "./IPositioned"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IAudio extends IPositioned {
    src: Nullable<string>
    autoplay: boolean
    loop: boolean
    distance: number
    distanceModel: string
    maxDistance: number
    rolloffFactor: number
}

export const audioSchema: Required<ExtractProps<IAudio>> = {
    ...positionedSchema,
    src: String,
    autoplay: Boolean,
    loop: Boolean,
    distance: Number,
    distanceModel: String,
    maxDistance: Number,
    rolloffFactor: Number
}

export const audioDefaults: Defaults<IAudio> ={
    ...positionedDefaults,
    src: undefined,
    autoplay: false,
    loop: false,
    distance: 1,
    maxDistance: 10000,
    distanceModel: "inverse",
    rolloffFactor: 1
}