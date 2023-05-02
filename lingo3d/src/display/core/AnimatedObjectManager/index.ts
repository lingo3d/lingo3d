import { Object3D } from "three"
import IAnimatedObjectManager, {
    Animation
} from "../../../interface/IAnimatedObjectManager"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { addConfigAnimationSystem } from "../../../systems/configSystems/configAnimationSystem"
import AnimationManager from "./AnimationManager"
import { getAnimationStates } from "./AnimationStates"

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IAnimatedObjectManager
{
    public get animations(): Record<string, AnimationManager> {
        return getAnimationStates(this).managerRecord
    }
    public set animations(val) {
        getAnimationStates(this).managerRecord = val
    }

    public get animationPaused(): boolean {
        return getAnimationStates(this).paused
    }
    public set animationPaused(value) {
        getAnimationStates(this).paused = value
    }

    public get animationRepeat(): number {
        return getAnimationStates(this).repeat
    }
    public set animationRepeat(value) {
        getAnimationStates(this).repeat = value
    }

    public get onAnimationFinish(): (() => void) | undefined {
        return getAnimationStates(this).onFinish
    }
    public set onAnimationFinish(value) {
        getAnimationStates(this).onFinish = value
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
        return getAnimationStates(this).manager?.totalFrames ?? 0
    }

    public get animationFrame(): number {
        return getAnimationStates(this).manager?.frame ?? 0
    }
    public set animationFrame(val) {
        const { manager } = getAnimationStates(this)
        if (manager) manager.frame = val
    }
}
