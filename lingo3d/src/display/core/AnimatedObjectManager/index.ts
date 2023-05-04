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
            new AnimationManager(
                name,
                undefined,
                self,
                getAnimationStates(self)
            ))
    )
    return animation
}

const setAnimation = (
    self: AnimatedObjectManager,
    val?: string | number | boolean | AnimationValue
) => {
    if (typeof val === "string" || typeof val === "number" || val === true) {
        self.$animationManager = getAnimationStates(self).manager =
            typeof val === "string"
                ? self.animations[val]
                : Object.values(self.animations)[val === true ? 0 : val]
        return
    }
    if (!val) {
        self.$animationManager = getAnimationStates(self).manager = undefined
        self.animationPaused = true
        return
    }
    const animationManager = getAnimation(self, "animation")
    animationManager.data = animationValueToData(val, self.uuid)
    self.$animationManager = getAnimationStates(self).manager = animationManager
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
