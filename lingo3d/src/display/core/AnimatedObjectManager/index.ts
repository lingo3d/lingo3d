import { Object3D } from "three"
import IAnimatedObjectManager, {
    Animation
} from "../../../interface/IAnimatedObjectManager"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { addConfigAnimationSystem } from "../../../systems/configSystems/configAnimationSystem"
import AnimationStates from "./AnimationStates"

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IAnimatedObjectManager
{
    private states?: AnimationStates
    public $lazyStates(): AnimationStates {
        if (this.states) return this.states
        return (this.states = new AnimationStates(this))
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
