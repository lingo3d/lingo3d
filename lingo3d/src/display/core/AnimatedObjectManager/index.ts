import { AnimationMixer, Object3D } from "three"
import IAnimatedObjectManager, {
    Animation,
    AnimationValue
} from "../../../interface/IAnimatedObjectManager"
import MeshAppendable from "../MeshAppendable"
import AnimationManager from "./AnimationManager"
import { STANDARD_FRAME } from "../../../globals"
import { AnimationData } from "../../../interface/IAnimationManager"
import AnimationStates from "./AnimationStates"

const animationValueToData = (val: AnimationValue, uuid: string) => {
    const entries = Object.entries(val)
    let maxLength = 0
    for (const [, { length }] of entries)
        length > maxLength && (maxLength = length)

    const duration = 1000
    const timeStep = (duration * 0.001) / maxLength

    const data: AnimationData = {}
    const result = (data[uuid] ??= {})
    for (const [name, values] of entries)
        result[name] = Object.fromEntries(
            values.map((v, i) => [Math.ceil(i * timeStep * STANDARD_FRAME), v])
        )
    return data
}

const getAnimation = (
    self: AnimatedObjectManager,
    name: string
): AnimationManager => {
    let animation = self.animations[name]
    if (animation && typeof animation !== "string") return animation
    self.append(
        (animation = self.animations[name] =
            new AnimationManager(name, self, self.$animationStates))
    )
    return animation
}

const setAnimation = (
    self: AnimatedObjectManager,
    val?: string | number | boolean | AnimationValue
) => {
    if (typeof val === "string" || typeof val === "number" || val === true) {
        const animationManager = (self.$animationStates.manager =
            typeof val === "string"
                ? (self.animations[val] as AnimationManager | undefined)
                : Object.values(self.animations)[val === true ? 0 : val])
        self.$mixer = animationManager?.$mixer
        return
    }
    if (!val) {
        self.$animationStates.manager = undefined
        self.$mixer = undefined
        self.animationPaused = true
        return
    }
    const animationManager = getAnimation(self, "animation")
    animationManager.data = animationValueToData(val, self.uuid)
    self.$animationStates.manager = animationManager
    self.$mixer = animationManager.$mixer
}

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
        setAnimation(this, val)
        this.animationPaused = this.animationPaused
    }

    public get animationFrame(): number {
        const time = this.$mixer?.time ?? 0
        return Math.ceil(time * STANDARD_FRAME)
    }
    public set animationFrame(val) {
        this.$animationStates.gotoFrame = val
    }
}
