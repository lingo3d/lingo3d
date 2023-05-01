import { AnimationMixer, AnimationClip, AnimationAction } from "three"
import { forceGetInstance, merge } from "@lincode/utils"
import { onBeforeRender } from "../../../events/onBeforeRender"
import { Reactive } from "@lincode/reactivity"
import IAnimationManager, {
    AnimationData,
    animationManagerDefaults,
    animationManagerSchema
} from "../../../interface/IAnimationManager"
import Appendable from "../../../api/core/Appendable"
import FoundManager from "../FoundManager"
import { INVERSE_STANDARD_FRAME, STANDARD_FRAME } from "../../../globals"
import { dtPtr } from "../../../pointers/dtPtr"
import AnimationStates from "./AnimationStates"
import { addConfigAnimationDataSystem } from "../../../systems/configSystems/configAnimationDataSystem"
import { addConfigAnimationClipSystem } from "../../../systems/configSystems/configAnimationClipSystem"

const targetMixerMap = new WeakMap<object, AnimationMixer>()
const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

export default class AnimationManager
    extends Appendable
    implements IAnimationManager
{
    public static componentName = "animation"
    public static defaults = animationManagerDefaults
    public static schema = animationManagerSchema

    public actionState = new Reactive<AnimationAction | undefined>(undefined)
    public clip?: AnimationClip
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

    public mixer: AnimationMixer

    public clipTotalFrames = 0
    public audioTotalFrames = 0
    public get totalFrames() {
        return Math.max(this.clipTotalFrames, this.audioTotalFrames)
    }

    public constructor(
        name: string | undefined,
        public $loadedClip: AnimationClip | undefined,
        target: object | undefined,
        animationStates: AnimationStates
    ) {
        super()
        this.disableSerialize = true
        this.name = name
        addConfigAnimationDataSystem(this)

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

        addConfigAnimationClipSystem(this)

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
            if (prevAction && action !== prevAction)
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
        const newClip = this.clip!.clone()
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

    private _data?: AnimationData
    public get data() {
        return this._data
    }
    public set data(val: AnimationData | undefined) {
        this._data = val
        addConfigAnimationDataSystem(this)
    }

    public mergeData(data: AnimationData) {
        if (!this.data) {
            this.data = data
            return
        }
        merge(this.data, data)
        this.data = this.data
    }

    public $frame?: number
    public get frame() {
        return Math.ceil(this.mixer.time * STANDARD_FRAME)
    }
    public set frame(val) {
        this.gotoFrameState.set(val)
    }
}
