import { AnimationMixer, Object3D } from "three"
import IAnimatedObjectManager, {
    Animation
} from "../../../interface/IAnimatedObjectManager"
import MeshAppendable from "../MeshAppendable"
import AnimationManager from "./AnimationManager"
import { STANDARD_FRAME } from "../../../globals"
import AnimationStates from "./AnimationStates"
import { configAnimationSystem } from "../../../systems/configLoadedSystems/configAnimationSystem"

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IAnimatedObjectManager
{
    private _animationStates?: AnimationStates
    public get $animationStates() {
        return (this._animationStates ??= new AnimationStates())
    }

    public get animations(): Record<string, AnimationManager> {
        return this.$animationStates.managerRecord
    }
    public set animations(val) {
        this.$animationStates.managerRecord = val
    }

    public get animationPaused() {
        return this.$animationStates.paused
    }
    public set animationPaused(value) {
        this.$animationStates.paused = value
    }

    public get animationLoop() {
        return this.$animationStates.loop
    }
    public set animationLoop(value) {
        this.$animationStates.loop = value
    }

    public get $animation() {
        return typeof this.animation !== "object" ? this.animation : undefined
    }

    public $mixer?: AnimationMixer

    private _animation?: Animation
    public get animation() {
        return this._animation
    }
    public set animation(val) {
        this._animation = val
        configAnimationSystem.add(this)
    }

    public get animationFrame(): number {
        const time = this.$mixer?.time ?? 0
        return Math.ceil(time * STANDARD_FRAME)
    }
    public set animationFrame(val) {
        this.$animationStates.gotoFrame = val
    }
}
