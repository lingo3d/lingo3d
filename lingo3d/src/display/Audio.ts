import { createEffect } from "@lincode/reactivity"
import { AudioListener, PositionalAudio } from "three"
import PositionedItem from "../api/core/PositionedItem"
import mainCamera from "../engine/mainCamera"
import scene from "../engine/scene"
import { onSelectionTarget, emitSelectionTarget } from "../events/onSelectionTarget"
import IAudio, { audioDefaults, audioSchema } from "../interface/IAudio"
import { getCameraRendered } from "../states/useCameraRendered"
import makeAudioSprite from "./core/utils/makeAudioSprite"
import loadAudio from "./utils/loaders/loadAudio"

const audioListener = new AudioListener()

createEffect(() => {
    const cam = getCameraRendered()
    cam.add(audioListener)

    return () => {
        cam.remove(audioListener)
    }
}, [getCameraRendered])

export default class Audio extends PositionedItem implements IAudio {
    public static componentName = "audio"
    public static defaults = audioDefaults
    public static schema = audioSchema

    private sound: PositionalAudio

    public constructor() {
        const sound = new PositionalAudio(audioListener)
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
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.sound.disconnect()
        return this
    }

    private _src?: string
    private srcCount = 0
    public get src() {
        return this._src
    }
    public set src(val) {
        if (this._src === val) return
        this._src = val
        
        const srcCount = ++this.srcCount
        
        if (!val) return

        loadAudio(val).then(buffer => {
            if (srcCount !== this.srcCount || this.done) return
            this.sound.setBuffer(buffer)
        })
    }

    public get autoplay() {
        return this.sound.autoplay
    }
    public set autoplay(val) {
        this.sound.autoplay = val
        val && this.sound.play()
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