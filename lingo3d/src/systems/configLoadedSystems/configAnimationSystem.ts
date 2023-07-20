import isBusy from "../../api/isBusy"
import Model from "../../display/Model"
import AnimatedObjectManager from "../../display/core/AnimatedObjectManager"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { STANDARD_FRAME } from "../../globals"
import { AnimationValue } from "../../interface/IAnimatedObjectManager"
import { AnimationData } from "../../interface/IAnimationManager"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

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

export const configAnimationSystem = createLoadedEffectSystem(
    "configAnimationSystem",
    {
        effect: (self: AnimatedObjectManager | Model) => {
            //await configAnimationLoadSystem
            queueMicrotask(() => setAnimation(self, self.animation))
        },
        loading: (self) =>
            "$loadedObject" in self && (!self.$loadedObject || isBusy())
    }
)
