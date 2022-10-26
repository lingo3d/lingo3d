import store, { createEffect, Reactive } from "@lincode/reactivity"
import { AudioListener, PositionalAudio } from "three"
import PositionedItem from "../api/core/PositionedItem"
import mainCamera from "../engine/mainCamera"
import IAudio, { audioDefaults, audioSchema } from "../interface/IAudio"
import { getCameraRendered } from "../states/useCameraRendered"
import { addSelectionHelper } from "./core/StaticObjectManager/raycast/selectionCandidates"
import HelperSprite from "./core/utils/HelperSprite"
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

export default class Audio
    extends PositionedItem<PositionalAudio>
    implements IAudio
{
    public static componentName = "audio"
    public static defaults = audioDefaults
    public static schema = audioSchema

    public constructor() {
        !getAudioListener() && setAudioListener(new AudioListener())
        const sound = new PositionalAudio(getAudioListener()!)
        super(sound)

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera) return

            const handle = addSelectionHelper(new HelperSprite("audio"), this)
            return () => {
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
                sound.setBuffer(buffer)
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

            sound.play()

            return () => {
                this.stoppedState.get() ? sound.stop() : sound.pause()
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
        this.outerObject3d.buffer && this.outerObject3d.disconnect()
        return this
    }

    public play() {
        this.autoplay = true
        this.paused = false
        this.stopped = false
    }

    public pause() {
        this.paused = true
    }

    public stop() {
        this.stopped = true
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
        return this.outerObject3d.loop
    }
    public set loop(val) {
        this.outerObject3d.loop = val
    }

    public get volume() {
        return this.outerObject3d.getVolume()
    }
    public set volume(val) {
        this.outerObject3d.setVolume(val)
    }

    public get playbackRate() {
        return this.outerObject3d.playbackRate
    }
    public set playbackRate(val) {
        this.outerObject3d.playbackRate = val
    }

    public get distance() {
        return this.outerObject3d.getRefDistance()
    }
    public set distance(val) {
        this.outerObject3d.setRefDistance(val)
    }

    public get distanceModel() {
        return this.outerObject3d.getDistanceModel()
    }
    public set distanceModel(val) {
        this.outerObject3d.setDistanceModel(val)
    }

    public get maxDistance() {
        return this.outerObject3d.getMaxDistance()
    }
    public set maxDistance(val) {
        this.outerObject3d.setMaxDistance(val)
    }

    public get rolloffFactor() {
        return this.outerObject3d.getRolloffFactor()
    }
    public set rolloffFactor(val) {
        this.outerObject3d.setRolloffFactor(val)
    }
}
