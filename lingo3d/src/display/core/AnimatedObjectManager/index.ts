import { Object3D } from "three"
import IAnimatedObjectManager, {
    Animation
} from "../../../interface/IAnimatedObjectManager"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { addConfigAnimationSystem } from "../../../systems/configSystems/configAnimationSystem"
import AnimationManager from "./AnimationManager"
import { getAnimationStates } from "../../../utilsCached/getAnimationStates"

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IAnimatedObjectManager
{
    public get animations(): Record<string, AnimationManager> {
        return getAnimationStates(this).managerRecordState.get()
    }
    public set animations(val) {
        getAnimationStates(this).managerRecordState.set(val)
    }

    public get animationPaused(): boolean {
        return getAnimationStates(this).pausedState.get()
    }
    public set animationPaused(value) {
        getAnimationStates(this).pausedState.set(value)
    }

    public get animationRepeat(): number {
        return getAnimationStates(this).repeatState.get()
    }
    public set animationRepeat(value) {
        getAnimationStates(this).repeatState.set(value)
    }

    public get onAnimationFinish(): (() => void) | undefined {
        return getAnimationStates(this).onFinishState.get()
    }
    public set onAnimationFinish(value) {
        getAnimationStates(this).onFinishState.set(value)
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

    public get animationLength(): number {
        return getAnimationStates(this).managerState.get()?.totalFrames ?? 0
    }

    public get animationFrame(): number {
        return getAnimationStates(this).managerState.get()?.frame ?? 0
    }
    public set animationFrame(val) {
        const manager = getAnimationStates(this).managerState.get()
        if (manager) manager.frame = val
    }
}
