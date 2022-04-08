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

export const soundDefaults: ISound = {
    onPlay: undefined,
    onPause: undefined,
    onEnded: undefined,
    stream: undefined,
    src: undefined,
    loop: undefined,
    autoplay: undefined,
    muted: undefined,
    playbackRate: undefined,
    volume: undefined,

    paused: true
}