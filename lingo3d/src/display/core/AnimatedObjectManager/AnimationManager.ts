import {
    Object3D,
    AnimationMixer,
    AnimationClip,
    NumberKeyframeTrack,
    AnimationAction
} from "three"
import { AnimationData } from "../../../api/serializer/types"
import { forceGet } from "@lincode/utils"
import { onBeforeRender } from "../../../events/onBeforeRender"
import { dt } from "../../../engine/eventLoop"
import { Reactive } from "@lincode/reactivity"
import { EventFunctions } from "@lincode/events"
import { nonSerializedAppendables } from "../../../api/core/collections"
import IAnimationManager, {
    animationManagerDefaults,
    animationManagerSchema
} from "../../../interface/IAnimationManager"
import Appendable from "../../../api/core/Appendable"
import FoundManager from "../FoundManager"
import StaticObjectManager from "../StaticObjectManager"

const targetMixerMap = new WeakMap<
    Object3D | StaticObjectManager,
    AnimationMixer
>()
const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

export default class AnimationManager
    extends Appendable
    implements IAnimationManager
{
    public static componentName = "animation"
    public static defaults = animationManagerDefaults
    public static schema = animationManagerSchema

    private actionState = new Reactive<AnimationAction | undefined>(undefined)
    private clipState = new Reactive<AnimationClip | undefined>(undefined)

    private pausedState = new Reactive(true)
    public get paused() {
        return this.pausedState.get()
    }
    public set paused(val) {
        this.pausedState.set(val)
    }

    public constructor(
        public name: string,
        clip: AnimationClip | undefined,
        target: Object3D | StaticObjectManager | undefined,
        repeatState: Reactive<number>,
        onFinishState: Reactive<(() => void) | undefined>,
        finishEventState?: Reactive<EventFunctions | undefined>
    ) {
        super()
        nonSerializedAppendables.add(this)

        const mixer = forceGet(
            targetMixerMap,
            target ?? this,
            () => new AnimationMixer(target as any)
        )
        this.createEffect(() => {
            if (this.pausedState.get()) return

            const finishEvent = finishEventState?.get()
            if (finishEvent) {
                const [emitFinish] = finishEvent
                const onFinish = () => emitFinish()
                mixer.addEventListener("finished", onFinish)
                return () => {
                    mixer.removeEventListener("finished", onFinish)
                }
            }
            const onFinish = onFinishState.get()
            if (!onFinish) return

            mixer.addEventListener("finished", onFinish)
            return () => {
                mixer.removeEventListener("finished", onFinish)
            }
        }, [onFinishState.get, this.pausedState.get, finishEventState?.get])

        if (clip) {
            this.clipState.set(clip)
            this.actionState.set(mixer.clipAction(clip))
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
            if (action)
                action.repetitions = finishEventState?.get()
                    ? 0
                    : repeatState.get()
        }, [this.actionState.get, repeatState.get, finishEventState?.get])

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
        target: FoundManager,
        repeatState: Reactive<number>,
        onFinishState: Reactive<(() => void) | undefined>,
        finishEventState: Reactive<EventFunctions | undefined>
    ) {
        const newClip = this.clipState.get()!.clone()
        const targetName = target.name + "."
        newClip.tracks = newClip.tracks.filter((track) =>
            track.name.startsWith(targetName)
        )
        const animation = new AnimationManager(
            this.name,
            newClip,
            target,
            repeatState,
            onFinishState,
            finishEventState
        )
        target.append(animation)
        return animation
    }

    public setTracks(data: AnimationData) {
        this.clipState.set(
            new AnimationClip(
                undefined,
                undefined,
                Object.entries(Object.values(data)[0]).map(
                    ([property, frames]) =>
                        new NumberKeyframeTrack(
                            "." + property,
                            frames.map(([frameNum]) => frameNum),
                            frames.map(([, frameValue]) => frameValue)
                        )
                )
            )
        )
    }
}
