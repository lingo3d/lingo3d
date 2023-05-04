import { Object3D } from "three"
import IAnimatedObjectManager, {
    Animation,
    AnimationValue
} from "../../../interface/IAnimatedObjectManager"
import MeshAppendable from "../../../api/core/MeshAppendable"
import AnimationManager from "./AnimationManager"
import getAnimationStates from "../../../utilsCached/getAnimationStates"
import { STANDARD_FRAME } from "../../../globals"
import { AnimationData } from "../../../interface/IAnimationManager"

const animationValueToData = (val: AnimationValue) => {
    const entries = Object.entries(val)
    let maxLength = 0
    for (const [, { length }] of entries)
        length > maxLength && (maxLength = length)

    const duration = 1000
    const timeStep = (duration * 0.001) / maxLength

    const data: AnimationData = {}
    const result = (data[""] ??= {})
    for (const [name, values] of entries)
        result[name] = Object.fromEntries(
            values.map((v, i) => [Math.ceil(i * timeStep * STANDARD_FRAME), v])
        )
    return data
}

const createAnimation = (
    self: AnimatedObjectManager,
    name: string
): AnimationManager => {
    let animation = self.animations[name]
    if (animation && typeof animation !== "string") return animation

    animation = self.watch(
        new AnimationManager(name, undefined, self, getAnimationStates(self))
    )
    self.append(animation)
    self.animations[name] = animation
    return animation
}

const setManager = (self: AnimatedObjectManager, val: string | number) => {
    self.$animationManager = getAnimationStates(self).manager =
        typeof val === "string"
            ? self.animations[val]
            : Object.values(self.animations)[val]
}

const setAnimation = (
    self: AnimatedObjectManager,
    val?: string | number | boolean | AnimationValue
) => {
    if (typeof val === "string" || typeof val === "number") {
        setManager(self, val)
        return
    }
    if (typeof val === "boolean") {
        if (val) setManager(self, 0)
        else self.animationPaused = true
        return
    }
    if (!val) {
        self.animationPaused = true
        return
    }
    const name = "animation"
    const anim = createAnimation(self, name)
    anim.data = animationValueToData(val)
    setManager(self, name)
}

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

    public get serializeAnimation() {
        return typeof this.animation !== "object" ? this.animation : undefined
    }

    public $animationManager?: AnimationManager
    
    private _animation?: Animation
    public get animation() {
        return this._animation
    }
    public set animation(val) {
        this._animation = val
        setAnimation(this, val)
    }

    public get animationFrame(): number {
        const time = this.$animationManager?.$mixer.time ?? 0
        return Math.ceil(time * STANDARD_FRAME)
    }
    public set animationFrame(val) {
        getAnimationStates(this).gotoFrame = val
    }
}
