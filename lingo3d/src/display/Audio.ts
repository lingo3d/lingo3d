import { createEffect } from "@lincode/reactivity"
import { AudioListener, PositionalAudio } from "three"
import PositionedItem from "../api/core/PositionedItem"
import scene from "../engine/scene"
import IAudio, { audioDefaults, audioSchema } from "../interface/IAudio"
import { getCamera } from "../states/useCamera"
import loadAudio from "./utils/loaders/loadAudio"

const audioListener = new AudioListener()

createEffect(() => {
    const cam = getCamera()
    cam.add(audioListener)

    return () => {
        cam.remove(audioListener)
    }
}, [getCamera])

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
    }

    public override dispose() {
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
        this._src = val
        const srcCount = ++this.srcCount
        if (!val) return

        loadAudio(val).then(buffer => {
            if (srcCount !== this.srcCount) return
            this.sound.setBuffer(buffer)
            this.sound.setRefDistance(20)
            this.sound.play()
        })
    }
}