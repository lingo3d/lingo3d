import {
    AnimationMixer,
    AnimationClip,
    NumberKeyframeTrack,
    AnimationAction
} from "three"
import { AnimationData } from "../../../api/serializer/types"
import { forceGet, merge } from "@lincode/utils"
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
import { Point, Point3d } from "@lincode/math"

const targetMixerMap = new WeakMap<object, AnimationMixer>()
const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

const framesToKeyframeTrack = (
    targetName: string,
    property: string,
    frames: Array<[number, number | Point | Point3d]>
) => {
    return new NumberKeyframeTrack(
        targetName + "." + property,
        frames.map(([frameNum]) => frameNum),
        frames.map(([, frameValue]) => frameValue)
    )
}

export default class AnimationManager
    extends Appendable
    implements IAnimationManager
{
    public static componentName = "animation"
    public static defaults = animationManagerDefaults
    public static schema = animationManagerSchema

    private actionState = new Reactive<AnimationAction | undefined>(undefined)
    private clipState = new Reactive<AnimationClip | undefined>(undefined)
    private dataState = new Reactive<[AnimationData | undefined]>([undefined])

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
        target: object | undefined,
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

        this.createEffect(() => {
            const [data] = this.dataState.get()
            if (!data) {
                this.clipState.set(clip)
                return
            }
            this.clipState.set(
                new AnimationClip(
                    undefined,
                    undefined,
                    Object.entries(data)
                        .map(([targetName, targetTracks]) =>
                            Object.entries(targetTracks).map(
                                ([property, frames]) =>
                                    framesToKeyframeTrack(
                                        targetName,
                                        property,
                                        frames
                                    )
                            )
                        )
                        .flat()
                )
            )
        }, [this.dataState.get])

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

    public setData(data: AnimationData) {
        this.dataState.set([data])
    }

    public addData(data: AnimationData) {
        const [prevData] = this.dataState.get()
        if (!prevData) {
            this.dataState.set([data])
            return
        }
        merge(prevData, data)
        this.dataState.set([prevData])
    }
}
