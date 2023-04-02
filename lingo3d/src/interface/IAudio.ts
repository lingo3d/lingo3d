import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IAudio extends IMeshAppendable {
    src: Nullable<string>
    autoplay: boolean
    paused: boolean
    stopped: boolean
    loop: boolean
    volume: number
    playbackRate: number
    distance: number
    distanceModel: string
    maxDistance: number
    rolloffFactor: number
}

export const audioSchema: Required<ExtractProps<IAudio>> = {
    ...meshAppendableSchema,
    src: String,
    autoplay: Boolean,
    paused: Boolean,
    stopped: Boolean,
    loop: Boolean,
    volume: Number,
    playbackRate: Number,
    distance: Number,
    distanceModel: String,
    maxDistance: Number,
    rolloffFactor: Number
}

export const audioDefaults = extendDefaults<IAudio>([meshAppendableDefaults], {
    src: undefined,
    autoplay: false,
    paused: false,
    stopped: false,
    loop: false,
    volume: 1,
    playbackRate: 1,
    distance: 1,
    maxDistance: 10000,
    distanceModel: "inverse",
    rolloffFactor: 1
})
