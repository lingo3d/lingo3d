import {
    AnimationMixer,
    AnimationClip,
    NumberKeyframeTrack,
    AnimationAction,
    BooleanKeyframeTrack
} from "three"
import { debounceTrailing, forceGet, merge } from "@lincode/utils"
import { onBeforeRender } from "../../../events/onBeforeRender"
import { dt } from "../../../engine/eventLoop"
import { GetGlobalState, Reactive } from "@lincode/reactivity"
import { EventFunctions } from "@lincode/events"
import {
    nonSerializedAppendables,
    uuidMap
} from "../../../api/core/collections"
import IAnimationManager, {
    AnimationData,
    animationManagerDefaults,
    animationManagerSchema,
    FrameData
} from "../../../interface/IAnimationManager"
import Appendable from "../../../api/core/Appendable"
import FoundManager from "../FoundManager"
import { FRAME2SEC, SEC2FRAME } from "../../../globals"
import TimelineAudio from "../../TimelineAudio"
import { Cancellable } from "@lincode/promiselikes"
import getPrivateValue from "../../../utils/getPrivateValue"

const targetMixerMap = new WeakMap<object, AnimationMixer>()
const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

const framesToKeyframeTrack = (
    targetName: string,
    property: string,
    frames: FrameData
) => {
    const keys = Object.keys(frames)
    if (!keys.length) return

    const values = Object.values(frames)
    const name = targetName + "." + property
    const frameNums = keys.map((frameNum) => Number(frameNum) * FRAME2SEC)

    if (typeof values[0] === "boolean")
        return new BooleanKeyframeTrack(name, frameNums, values)

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
    private dataState = new Reactive<[AnimationData | undefined]>([undefined])
    private gotoFrameState = new Reactive<number | undefined>(undefined)

    private awaitState = new Reactive(0)
    public get await() {
        return this.awaitState.get()
    }
    public set await(val) {
        this.awaitState.set(val)
    }

    protected pausedState = new Reactive(true)
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
        public name: string,
        clip: AnimationClip | undefined,
        target: object | undefined,
        repeatState: Reactive<number>,
        onFinishState: Reactive<(() => void) | undefined>,
        finishEventState?: Reactive<EventFunctions | undefined>,
        serialized?: boolean
    ) {
        super()
        !serialized && nonSerializedAppendables.add(this)

        const mixer = (this.mixer = forceGet(
            targetMixerMap,
            target ?? this,
            () => new AnimationMixer(target as any)
        ))
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
                                getPrivateValue(instance, "durationState").get
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
                            .filter(Boolean)
                    })
                    .flat()
            )
            this.clipState.set(newClip)
            const handle = new Cancellable()
            const computeAudioDuration = debounceTrailing(() => {
                if (handle.done) return
                const maxDuration = Math.max(
                    ...audioDurationGetters.map((getter) => getter())
                )
                this.audioTotalFrames = Math.ceil(maxDuration * SEC2FRAME)
            })
            for (const getAudioDuration of audioDurationGetters)
                handle.watch(getAudioDuration(computeAudioDuration))

            return () => {
                handle.cancel()
            }
        }, [this.dataState.get])

        let frame: number | undefined
        this.createEffect(() => {
            const clip = this.clipState.get()
            if (!clip) {
                this.clipTotalFrames = 0
                return
            }
            this.clipTotalFrames = Math.ceil(clip.duration * SEC2FRAME)

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
                action.repetitions = finishEventState?.get()
                    ? 0
                    : repeatState.get()
        }, [this.actionState.get, repeatState.get, finishEventState?.get])

        this.createEffect(() => {
            const action = this.actionState.get()
            if (!action) return

            const gotoFrame = this.gotoFrameState.get()
            action.paused =
                (this.pausedState.get() || !!this.awaitState.get()) &&
                gotoFrame === undefined
            if (action.paused) return

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
                mixer.setTime(gotoFrame * FRAME2SEC)
                this.gotoFrameState.set(undefined)
                return
            }
            const handle = onBeforeRender(() => mixer.update(dt[0]))
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

    public get data() {
        return this.dataState.get()[0]
    }
    public set data(val: AnimationData | undefined) {
        this.dataState.set([val])
    }

    public mergeData(data: AnimationData) {
        const [prevData] = this.dataState.get()
        if (!prevData) {
            this.dataState.set([data])
            return
        }
        merge(prevData, data)
        this.dataState.set([prevData])
    }

    public get frame() {
        return Math.ceil(this.mixer.time * SEC2FRAME)
    }
    public set frame(val) {
        this.gotoFrameState.set(val)
    }
}
