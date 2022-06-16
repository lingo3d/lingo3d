import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ISound {
    onPlay: Nullable<() => void>
    onPause: Nullable<() => void>
    onEnded: Nullable<() => void>
    stream: Nullable<boolean>
    src: Nullable<string>
    loop: Nullable<boolean>
    autoplay: Nullable<boolean>
    muted: Nullable<boolean>
    playbackRate: Nullable<number>
    volume: Nullable<number>

    paused: boolean
}

export const soundSchema: Required<ExtractProps<ISound>> = {
    onPlay: Function,
    onPause: Function,
    onEnded: Function,
    stream: Boolean,
    src: String,
    loop: Boolean,
    autoplay: Boolean,
    muted: Boolean,
    playbackRate: Number,
    volume: Number,

    paused: Boolean
}

export const soundDefaults: Defaults<ISound> = {
    onPlay: undefined,
    onPause: undefined,
    onEnded: undefined,
    stream: [undefined, false],
    src: undefined,
    loop: [undefined, false],
    autoplay: [undefined, false],
    muted: [undefined, false],
    playbackRate: [undefined, 1],
    volume: [undefined, 1],

    paused: true
}