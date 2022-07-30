import store, { createEffect, Reactive } from "@lincode/reactivity"
import { AudioListener, PositionalAudio } from "three"
import PositionedItem from "../api/core/PositionedItem"
import mainCamera from "../engine/mainCamera"
import scene from "../engine/scene"
import {
    onSelectionTarget,
    emitSelectionTarget
} from "../events/onSelectionTarget"
import IAudio, { audioDefaults, audioSchema } from "../interface/IAudio"
import { getCameraRendered } from "../states/useCameraRendered"
import makeAudioSprite from "./core/utils/makeAudioSprite"
import loadAudio from "./utils/loaders/loadAudio"

const [setAudioListener, getAudioListener] = store<AudioListener | undefined>(
    undefined
)

createEffect(() => {
    const audioListener = getAudioListener()
    if (!audioListener) return

    const cam = getCameraRendered()
    cam.add(audioListener)

    return () => {
        cam.remove(audioListener)
    }
}, [getCameraRendered, getAudioListener])

export default class Audio extends PositionedItem implements IAudio {
    public static componentName = "audio"
    public static defaults = audioDefaults
    public static schema = audioSchema

    private sound: PositionalAudio

    public constructor() {
        !getAudioListener() && setAudioListener(new AudioListener())
        const sound = new PositionalAudio(getAudioListener()!)
        super(sound)
        this.sound = sound
        scene.add(sound)

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const sprite = makeAudioSprite()
            this.outerObject3d.add(sprite.outerObject3d)

            const handle = onSelectionTarget(({ target }) => {
                target === sprite && emitSelectionTarget(this)
            })
            return () => {
                sprite.dispose()
                handle.cancel()
            }
        }, [getCameraRendered])

        const [setReady, getReady] = store(false)

        this.createEffect(() => {
            const src = this.srcState.get()
            if (!src) return

            let proceed = true
            loadAudio(src).then((buffer) => {
                if (!proceed) return
                this.sound.setBuffer(buffer)
                setReady(true)
            })
            return () => {
                proceed = false
                setReady(false)
            }
        }, [this.srcState.get])

        this.createEffect(() => {
            if (
                !getReady() ||
                !this.autoplayState.get() ||
                this.pausedState.get() ||
                this.stoppedState.get()
            )
                return

            this.sound.play()

            return () => {
                this.stoppedState.get() ? this.sound.stop() : this.sound.pause()
            }
        }, [
            getReady,
            this.autoplayState.get,
            this.pausedState.get,
            this.stoppedState.get
        ])
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.sound.buffer && this.sound.disconnect()
        return this
    }

    private srcState = new Reactive<string | undefined>(undefined)
    public get src() {
        return this.srcState.get()
    }
    public set src(val) {
        this.srcState.set(val)
    }

    private autoplayState = new Reactive(false)
    public get autoplay() {
        return this.autoplayState.get()
    }
    public set autoplay(val) {
        this.autoplayState.set(val)
    }

    private pausedState = new Reactive(false)
    public get paused() {
        return this.pausedState.get()
    }
    public set paused(val) {
        this.pausedState.set(val)
    }

    private stoppedState = new Reactive(false)
    public get stopped() {
        return this.stoppedState.get()
    }
    public set stopped(val) {
        this.stoppedState.set(val)
    }

    public get loop() {
        return this.sound.loop
    }
    public set loop(val) {
        this.sound.loop = val
    }

    public get distance() {
        return this.sound.getRefDistance()
    }
    public set distance(val) {
        this.sound.setRefDistance(val)
    }

    public get distanceModel() {
        return this.sound.getDistanceModel()
    }
    public set distanceModel(val) {
        this.sound.setDistanceModel(val)
    }

    public get maxDistance() {
        return this.sound.getMaxDistance()
    }
    public set maxDistance(val) {
        this.sound.setMaxDistance(val)
    }

    public get rolloffFactor() {
        return this.sound.getRolloffFactor()
    }
    public set rolloffFactor(val) {
        this.sound.setRolloffFactor(val)
    }
}
