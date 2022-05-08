import { Disposable, Resolvable } from "@lincode/promiselikes"
import type { Howl } from "howler"
import ISound, { soundDefaults, soundSchema } from "../interface/ISound"

export class Sound extends Disposable implements ISound {
    public static componentName = "sound"
    public static defaults = soundDefaults
    public static schema = soundSchema

    public onPlay?: () => void

    public onPause?: () => void

    public onEnded?: () => void

    public override dispose() {
        super.dispose()
        this.sound?.stop()
        this.sound?.unload()
        return this
    }
    
    private _paused = true
    public get paused() {
        return this._paused
    }
    public set paused(val: boolean) {
        this._paused = val
        if (val)
            this.play()
        else
            this.pause()
    }

    public stream?: boolean

    private sound?: Howl
    private soundResolvable = new Resolvable<Howl>()

    private _src: string | undefined
    public get src() {
        return this._src
    }
    public set src(src: string | undefined) {
        this._src = src
        this.sound?.stop()
        this.sound = undefined
        this.soundResolvable.done && (this.soundResolvable = new Resolvable())
        
        src && import("howler").then(module => {
            if (this.done || src !== this.src) return

            this.sound = new module.default.Howl({
                src,
                onplay: this.onPlay,
                onpause: this.onPause,
                onend: this.onEnded,
                loop: this._loop,
                autoplay: this._autoplay,
                mute: this._muted,
                rate: this._playbackRate,
                volume: this._volume,
                html5: this.stream
            })
            this.soundResolvable.resolve(this.sound)
        })
    }

    private _loop: boolean | undefined
    public get loop() {
        return this._loop
    }
    public set loop(loop: boolean | undefined) {
        this._loop = loop
        this.sound?.loop(!!loop)
    }

    private _autoplay: boolean | undefined
    public get autoplay() {
        return this._autoplay
    }
    public set autoplay(autoplay: boolean | undefined) {
        this._autoplay = autoplay
        autoplay && this.play()
    }

    private _muted?: boolean
    public get muted() {
        return this._muted
    }
    public set muted(muted: boolean | undefined) {
        this._muted = muted
        this.sound?.mute(!!muted)
    }

    private _playbackRate?: number
    public get playbackRate() {
        return this._playbackRate
    }
    public set playbackRate(playbackRate: number | undefined) {
        this._playbackRate = playbackRate
        this.sound?.rate(playbackRate ?? 1)
    }

    private _volume?: number
    public get volume() {
        return this._volume
    }
    public set volume(volume: number | undefined) {
        this._volume = volume
        this.sound?.volume(volume ?? 1)
    }

    public get duration() {
        return this.sound?.duration()
    }

    public fade(from: number, to: number, duration = 1000) {
        this.soundResolvable.then(sound => sound.fade(from, to, duration))
    }
    
    public play() {
        this.soundResolvable.then(sound => sound.play())
        this._paused = false
    }

    public pause() {
        this.soundResolvable.then(sound => sound.pause())
        this._paused = true
    }

    public stop() {
        this.soundResolvable.then(sound => sound.stop())
        this._paused = true
    }
}