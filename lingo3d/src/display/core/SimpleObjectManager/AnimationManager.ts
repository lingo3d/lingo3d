import { Cancellable, Disposable } from "@lincode/promiselikes"
import { Object3D, AnimationMixer, AnimationClip, NumberKeyframeTrack, AnimationAction, LoopRepeat, LoopOnce } from "three"
import { AnimationData } from "../../utils/deserialize/types"
import { forceGet } from "@lincode/utils"
import clockDelta from "../../utils/clockDelta"
import AnimationItem from "./AnimationItem"
import { loop } from "../../../engine/eventLoop"

const targetMixerMap = new WeakMap<AnimationItem | Object3D, AnimationMixer>()
const mixerActionMap = new WeakMap<AnimationMixer, [AnimationAction, boolean]>()
const mixerHandleMap = new WeakMap<AnimationMixer, Cancellable>()

export type PlayOptions = {
    crossFade?: number
    repeat?: boolean
    onFinish?: () => void
}

export default class AnimationManager extends Disposable {
    private clip?: AnimationClip
    public name: string
    private mixer: AnimationMixer
    private action?: AnimationAction

    public constructor(
        nameOrClip: string | AnimationClip,
        target: AnimationItem | Object3D
    ) {
        super()

        this.mixer = forceGet(targetMixerMap, target, () => new AnimationMixer(target as any))

        if (typeof nameOrClip === "string")
            this.name = nameOrClip
        else {
            this.name = nameOrClip.name
            this.loadClip(nameOrClip)
        }
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.stop()
        return this
    }
    
    public get duration() {
        return this.clip?.duration ?? 0
    }

    private loadClip(clip: AnimationClip) {
        this.clip = clip
        this.action = this.mixer.clipAction(clip)
    }

    public setTracks(data: AnimationData) {
        const tracks = Object.entries(data).map(([property, frames]) => new NumberKeyframeTrack(
            "." + property,
            Object.keys(frames).map(t => Number(t)),
            Object.values(frames)
        ))
        this.clip && (this.mixer.uncacheClip(this.clip))
        this.loadClip(new AnimationClip(this.name, -1, tracks))
    }

    public play({ crossFade = 0.25, repeat = true, onFinish }: PlayOptions = {}) {
        const [prevAction, prevRepeat] = mixerActionMap.get(this.mixer) ?? []
        if (prevAction && this.action === prevAction) {
            repeat !== prevRepeat && prevAction.setLoop(repeat ? LoopRepeat : LoopOnce, Infinity)
            return
        }

        mixerHandleMap.get(this.mixer)?.cancel()
        const handle = this.watch(loop(() => this.mixer.update(clockDelta[0])))
        mixerHandleMap.set(this.mixer, handle)

        const { action } = this
        if (!action) return

        if (prevAction && crossFade) {
            action.time = 0
            action.enabled = true
            action.crossFadeFrom(prevAction, crossFade, true)
        }
        else this.mixer.stopAllAction()

        mixerActionMap.set(this.mixer, [action, repeat])
        action.setLoop(repeat ? LoopRepeat : LoopOnce, Infinity)
        action.clampWhenFinished = true

        const handleFinish = () => onFinish?.()
        this.mixer.addEventListener("finished", handleFinish)
        handle.then(() => this.mixer.removeEventListener("finished", handleFinish))

        action.paused && action.stop()
        action.play()
    }

    public stop() {
        this.action && (this.action.paused = true)
        mixerHandleMap.get(this.mixer)?.cancel()
    }

    public update(seconds: number) {
        this.mixer.time = 0
        this.action && (this.action.time = 0)
        this.mixer.update(seconds)
    }
}