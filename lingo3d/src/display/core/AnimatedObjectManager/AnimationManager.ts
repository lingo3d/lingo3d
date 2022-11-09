import {
    Object3D,
    AnimationMixer,
    AnimationClip,
    NumberKeyframeTrack,
    AnimationAction,
    LoopRepeat,
    LoopOnce
} from "three"
import { AnimationData } from "../../../api/serializer/types"
import { forceGet } from "@lincode/utils"
import EventLoopItem from "../../../api/core/EventLoopItem"
import { onBeforeRender } from "../../../events/onBeforeRender"
import { dt } from "../../../engine/eventLoop"
import { Reactive } from "@lincode/reactivity"

const targetMixerMap = new WeakMap<EventLoopItem | Object3D, AnimationMixer>()
const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

export default class AnimationManager extends EventLoopItem {
    public name: string

    private actionState = new Reactive<AnimationAction | undefined>(undefined)
    private clipState = new Reactive<AnimationClip | undefined>(undefined)
    public pausedState = new Reactive(false)

    public constructor(
        nameOrClip: string | AnimationClip,
        target: EventLoopItem | Object3D,
        private repeatState: Reactive<number>,
        private onFinishState: Reactive<(() => void) | undefined>
    ) {
        super()

        const mixer = forceGet(
            targetMixerMap,
            target,
            () => new AnimationMixer(target as any)
        )
        this.createEffect(() => {
            const onFinish = this.onFinishState.get()
            if (!onFinish || this.pausedState.get()) return

            mixer.addEventListener("finished", onFinish)
            return () => {
                mixer.removeEventListener("finished", onFinish)
            }
        }, [this.onFinishState.get, this.pausedState.get])

        if (typeof nameOrClip === "string") this.name = nameOrClip
        else {
            this.name = nameOrClip.name
            this.clipState.set(nameOrClip)
            this.actionState.set(mixer.clipAction(nameOrClip))
        }

        this.createEffect(() => {
            const clip = this.clipState.get()
            if (!clip) return

            this.actionState.set(mixer.clipAction(clip))

            return () => {
                mixer.uncacheClip(clip)
            }
        }, [this.clipState.get])

        this.createEffect(() => {
            const action = this.actionState.get()
            if (!action) return

            const repeat = this.repeatState.get()
            action.setLoop(repeat ? LoopRepeat : LoopOnce, repeat)
        }, [this.actionState.get, this.repeatState.get])

        this.createEffect(() => {
            const action = this.actionState.get()
            if (!action) return

            action.paused = this.pausedState.get()
            if (action.paused) return

            const prevManager = mixerManagerMap.get(mixer)
            mixerManagerMap.set(mixer, this)
            if (prevManager && prevManager !== this)
                prevManager.pausedState.set(true)

            const prevAction = mixerActionMap.get(mixer)
            mixerActionMap.set(mixer, action)
            if (prevAction && action !== prevAction) {
                action.crossFadeFrom(prevAction, 0.25, true)
                action.time = 0
            }
            action.clampWhenFinished = true
            action.enabled = true
            action.play()

            const handle = onBeforeRender(() => mixer.update(dt[0]))
            return () => {
                handle.cancel()
            }
        }, [this.actionState.get, this.pausedState.get])
    }

    public retarget(
        target: Object3D,
        repeatState: Reactive<number>,
        onFinishState: Reactive<(() => void) | undefined>
    ) {
        const newClip = this.clipState.get()!.clone()
        const targetName = target.name + "."
        newClip.tracks = newClip.tracks.filter((track) =>
            track.name.startsWith(targetName)
        )
        return new AnimationManager(newClip, target, repeatState, onFinishState)
    }

    public get duration() {
        return this.clipState.get()?.duration ?? 0
    }

    public setTracks(data: AnimationData) {
        this.clipState.set(
            new AnimationClip(
                this.name,
                -1,
                Object.entries(data).map(
                    ([property, frames]) =>
                        new NumberKeyframeTrack(
                            "." + property,
                            Object.keys(frames).map((t) => Number(t)),
                            Object.values(frames)
                        )
                )
            )
        )
    }
}
