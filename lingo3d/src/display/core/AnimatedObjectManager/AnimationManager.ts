import {
    AnimationMixer,
    AnimationClip,
    NumberKeyframeTrack,
    AnimationAction,
    BooleanKeyframeTrack
} from "three"
import {
    throttleTrailing,
    filterBoolean,
    forceGetInstance,
    merge
} from "@lincode/utils"
import { onBeforeRender } from "../../../events/onBeforeRender"
import { GetGlobalState, Reactive } from "@lincode/reactivity"
import { EventFunctions } from "@lincode/events"
import IAnimationManager, {
    AnimationData,
    animationManagerDefaults,
    animationManagerSchema,
    FrameData,
    FrameValue
} from "../../../interface/IAnimationManager"
import Appendable from "../../../api/core/Appendable"
import FoundManager from "../FoundManager"
import { INVERSE_STANDARD_FRAME, STANDARD_FRAME } from "../../../globals"
import TimelineAudio from "../../TimelineAudio"
import { Cancellable } from "@lincode/promiselikes"
import { uuidMap } from "../../../collections/uuidCollections"
import { dtPtr } from "../../../pointers/dtPtr"
import AnimationStates from "./AnimationStates"

const targetMixerMap = new WeakMap<object, AnimationMixer>()
const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

const isBooleanFrameData = (
    values: Array<FrameValue>
): values is Array<boolean> => typeof values[0] === "boolean"

const isNumberFrameData = (
    values: Array<FrameValue>
): values is Array<number> => typeof values[0] === "number"

const framesToKeyframeTrack = (
    targetName: string,
    property: string,
    frames: FrameData
) => {
    const keys = Object.keys(frames)
    if (!keys.length) return

    const values = Object.values(frames)
    const name = targetName + "." + property
    const frameNums = keys.map(
        (frameNum) => Number(frameNum) * INVERSE_STANDARD_FRAME
    )

    if (isBooleanFrameData(values))
        return new BooleanKeyframeTrack(name, frameNums, values)

    if (isNumberFrameData(values))
        return new NumberKeyframeTrack(name, frameNums, values)
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
    public timelineDataState = new Reactive<[AnimationData | undefined]>([
        undefined
    ])
    private gotoFrameState = new Reactive<number | undefined>(undefined)

    private awaitState = new Reactive(0)
    public get await() {
        return this.awaitState.get()
    }
    public set await(val) {
        this.awaitState.set(val)
    }

    public pausedState = new Reactive(true)
    public get paused() {
        return this.pausedState.get()
    }
    public set paused(val) {
        this.pausedState.set(val)
    }

    private mixer: AnimationMixer

    public clipTotalFrames = 0
    public audioTotalFrames = 0
    public get totalFrames() {
        return Math.max(this.clipTotalFrames, this.audioTotalFrames)
    }

    public constructor(
        name: string | undefined,
        clip: AnimationClip | undefined,
        target: object | undefined,
        animationStates: AnimationStates
    ) {
        super()
        this.disableSerialize = true
        this.name = name

        const mixer = (this.mixer = forceGetInstance(
            targetMixerMap,
            target ?? this,
            AnimationMixer,
            [target]
        ))
        this.createEffect(() => {
            if (this.pausedState.get()) return

            const finishEvent = animationStates.finishEventState?.get()
            if (finishEvent) {
                const [emitFinish] = finishEvent
                const onFinish = () => emitFinish()
                mixer.addEventListener("finished", onFinish)
                return () => {
                    mixer.removeEventListener("finished", onFinish)
                }
            }
            const onFinish = animationStates.onFinishState.get()
            if (!onFinish) return

            mixer.addEventListener("finished", onFinish)
            return () => {
                mixer.removeEventListener("finished", onFinish)
            }
        }, [
            animationStates.onFinishState.get,
            this.pausedState.get,
            animationStates.finishEventState?.get
        ])

        this.createEffect(() => {
            const [data] = this.timelineDataState.get()
            if (!data) {
                this.clipState.set(clip)
                this.audioTotalFrames = 0
                return
            }
            const audioDurationGetters: Array<GetGlobalState<number>> = []
            const newClip = new AnimationClip(
                undefined,
                undefined,
                Object.entries(data)
                    .map(([targetName, targetTracks]) => {
                        const instance = uuidMap.get(targetName)
                        if (!instance) return []
                        if (instance instanceof TimelineAudio) {
                            audioDurationGetters.push(
                                instance.durationState.get
                            )
                            return []
                        }
                        return Object.entries(targetTracks)
                            .map(
                                ([property, frames]) =>
                                    framesToKeyframeTrack(
                                        targetName,
                                        property,
                                        frames
                                    )!
                            )
                            .filter(filterBoolean)
                    })
                    .flat()
            )
            this.clipState.set(newClip)
            const handle = new Cancellable()
            const computeAudioDuration = throttleTrailing(() => {
                if (handle.done) return
                const maxDuration = Math.max(
                    ...audioDurationGetters.map((getter) => getter())
                )
                this.audioTotalFrames = Math.ceil(maxDuration * STANDARD_FRAME)
            })
            for (const getAudioDuration of audioDurationGetters)
                handle.watch(getAudioDuration(computeAudioDuration))

            return () => {
                handle.cancel()
            }
        }, [this.timelineDataState.get])

        let frame: number | undefined
        this.createEffect(() => {
            const clip = this.clipState.get()
            if (!clip) {
                this.clipTotalFrames = 0
                return
            }
            this.clipTotalFrames = Math.ceil(clip.duration * STANDARD_FRAME)

            const action = mixer.clipAction(clip)
            this.actionState.set(action)

            if (frame !== undefined) {
                this.frame = frame
                frame = undefined
            }

            return () => {
                frame = this.frame
                action.stop()
                action.enabled = false
                mixer.uncacheClip(clip)
            }
        }, [this.clipState.get])

        this.createEffect(() => {
            const action = this.actionState.get()
            if (action)
                action.repetitions = animationStates.finishEventState?.get()
                    ? 0
                    : animationStates.repeatState.get()
        }, [
            this.actionState.get,
            animationStates.repeatState.get,
            animationStates.finishEventState?.get
        ])

        this.createEffect(() => {
            const action = this.actionState.get()
            if (!action) return

            const gotoFrame = this.gotoFrameState.get()
            if (
                (action.paused =
                    (this.pausedState.get() || !!this.awaitState.get()) &&
                    gotoFrame === undefined)
            )
                return

            const prevManager = mixerManagerMap.get(mixer)
            mixerManagerMap.set(mixer, this)
            if (prevManager && prevManager !== this)
                prevManager.pausedState.set(true)

            const prevAction = mixerActionMap.get(mixer)
            mixerActionMap.set(mixer, action)
            if (prevAction?.enabled && action !== prevAction)
                action.crossFadeFrom(prevAction, 0.25, true)

            action.clampWhenFinished = true
            action.enabled = true
            action.play()

            if (gotoFrame !== undefined) {
                if (prevManager && prevManager !== this)
                    action.time = gotoFrame * INVERSE_STANDARD_FRAME
                else mixer.setTime(gotoFrame * INVERSE_STANDARD_FRAME)
                this.gotoFrameState.set(undefined)
                return
            }
            const handle = onBeforeRender(() => mixer.update(dtPtr[0]))
            return () => {
                handle.cancel()
            }
        }, [
            this.actionState.get,
            this.pausedState.get,
            this.awaitState.get,
            this.gotoFrameState.get
        ])
    }

    public retarget(target: FoundManager, animationStates: AnimationStates) {
        const newClip = this.clipState.get()!.clone()
        const targetName = target.name + "."
        newClip.tracks = newClip.tracks.filter((track) =>
            track.name.startsWith(targetName)
        )
        const animation = new AnimationManager(
            this.name,
            newClip,
            target,
            animationStates
        )
        target.append(animation)
        return animation
    }

    public get data() {
        return this.timelineDataState.get()[0]
    }
    public set data(val: AnimationData | undefined) {
        this.timelineDataState.set([val])
    }

    public mergeData(data: AnimationData) {
        const [prevData] = this.timelineDataState.get()
        if (!prevData) {
            this.timelineDataState.set([data])
            return
        }
        merge(prevData, data)
        this.timelineDataState.set([prevData])
    }

    public get frame() {
        return Math.ceil(this.mixer.time * STANDARD_FRAME)
    }
    public set frame(val) {
        this.gotoFrameState.set(val)
    }
}
