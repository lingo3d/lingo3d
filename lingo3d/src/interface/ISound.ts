import { ExtractProps } from "./utils/extractProps"

export default interface ISound {
    onPlay?: () => void
    onPause?: () => void
    onEnded?: () => void
    stream?: boolean
    src?: string
    loop?: boolean
    autoplay?: boolean
    muted?: boolean
    playbackRate?: number
    volume?: number

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

export const soundDefaults: ISound = {
    paused: true
}