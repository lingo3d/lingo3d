import { Object3D } from "three"
import IAnimatedObjectManager, {
    Animation
} from "../../../interface/IAnimatedObjectManager"
import AnimationManager from "./AnimationManager"
import { Reactive } from "@lincode/reactivity"
import { EventFunctions } from "@lincode/events"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    addConfigAnimationSystem,
    deleteConfigAnimationSystem
} from "../../../systems/configSystems/configAnimationSystem"
type States = {
    managerRecordState: Reactive<Record<string, AnimationManager>>
    managerState: Reactive<AnimationManager | undefined>
    pausedState: Reactive<boolean>
    repeatState: Reactive<number>
    onFinishState: Reactive<(() => void) | undefined>
    finishEventState: Reactive<EventFunctions | undefined>
}

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IAnimatedObjectManager
{
    private states?: States
    public $lazyStates() {
        if (this.states) return this.states

        const { managerState, pausedState } = (this.states = {
            managerRecordState: new Reactive<Record<string, AnimationManager>>(
                {}
            ),
            managerState: new Reactive<AnimationManager | undefined>(undefined),
            pausedState: new Reactive(false),
            repeatState: new Reactive(Infinity),
            onFinishState: new Reactive<(() => void) | undefined>(undefined),
            finishEventState: new Reactive<EventFunctions | undefined>(
                undefined
            )
        })
        this.createEffect(() => {
            const manager = managerState.get()
            if (manager) manager.paused = pausedState.get()
        }, [managerState.get, pausedState.get])

        return this.states
    }

    public get animations() {
        return this.$lazyStates().managerRecordState.get()
    }
    public set animations(val) {
        this.$lazyStates().managerRecordState.set(val)
    }

    public get animationPaused() {
        return this.$lazyStates().pausedState.get()
    }
    public set animationPaused(value) {
        this.$lazyStates().pausedState.set(value)
    }

    public get animationRepeat() {
        return this.$lazyStates().repeatState.get()
    }
    public set animationRepeat(value) {
        this.$lazyStates().repeatState.set(value)
    }

    public get onAnimationFinish() {
        return this.$lazyStates().onFinishState.get()
    }
    public set onAnimationFinish(value) {
        this.$lazyStates().onFinishState.set(value)
    }

    public get serializeAnimation() {
        return typeof this.$animation !== "object" ? this.$animation : undefined
    }

    public $animation?: Animation
    public get animation() {
        return this.$animation
    }
    public set animation(val) {
        this.$animation = val
        addConfigAnimationSystem(this)
    }

    public get animationLength() {
        return this.$lazyStates().managerState.get()?.totalFrames ?? 0
    }

    public get animationFrame() {
        return this.$lazyStates().managerState.get()?.frame ?? 0
    }
    public set animationFrame(val) {
        const manager = this.$lazyStates().managerState.get()
        if (manager) manager.frame = val
    }
}
