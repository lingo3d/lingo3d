import store, { Reactive, createEffect } from "@lincode/reactivity"
import { AudioListener, PositionalAudio } from "three"
import IAudio, { audioDefaults, audioSchema } from "../interface/IAudio"
import HelperSprite from "./core/helperPrimitives/HelperSprite"
import loadAudio from "./utils/loaders/loadAudio"
import MeshAppendable from "./core/MeshAppendable"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { getCameraRendered } from "../states/useCameraRendered"
import { helperSystem } from "../systems/eventSystems/helperSystem"
import { configHelperSystem } from "../systems/configSystems/configHelperSystem"

const audioListener = new AudioListener()

createEffect(() => {
    const [cam] = cameraRenderedPtr
    cam.add(audioListener)

    return () => {
        cam.remove(audioListener)
    }
}, [getCameraRendered])

export default class Audio
    extends MeshAppendable<PositionalAudio>
    implements IAudio
{
    public static componentName = "audio"
    public static defaults = audioDefaults
    public static schema = audioSchema

    public $createHelper() {
        return new HelperSprite("audio", this)
    }

    public constructor() {
        const sound = new PositionalAudio(audioListener)
        super(sound)

        helperSystem.add(this)
        configHelperSystem.add(this)

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

    protected override disposeNode() {
        super.disposeNode()
        this.$object.buffer && this.$object.disconnect()
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
        return this.$object.loop
    }
    public set loop(val) {
        this.$object.loop = val
    }

    public get volume() {
        return this.$object.getVolume()
    }
    public set volume(val) {
        this.$object.setVolume(val)
    }

    public get playbackRate() {
        return this.$object.playbackRate
    }
    public set playbackRate(val) {
        this.$object.playbackRate = val
    }

    public get distance() {
        return this.$object.getRefDistance()
    }
    public set distance(val) {
        this.$object.setRefDistance(val)
    }

    public get distanceModel() {
        return this.$object.getDistanceModel()
    }
    public set distanceModel(val) {
        this.$object.setDistanceModel(val)
    }

    public get maxDistance() {
        return this.$object.getMaxDistance()
    }
    public set maxDistance(val) {
        this.$object.setMaxDistance(val)
    }

    public get rolloffFactor() {
        return this.$object.getRolloffFactor()
    }
    public set rolloffFactor(val) {
        this.$object.setRolloffFactor(val)
    }
}
