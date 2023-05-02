import { event } from "@lincode/events"
import AnimatedObjectManager from "../../display/core/AnimatedObjectManager"
import { AnimationValue } from "../../interface/IAnimatedObjectManager"
import { addConfigAnimationManagerSystem } from "../configLoadedSystems/configAnimationManagerSystem"
import { AnimationData } from "../../interface/IAnimationManager"
import { STANDARD_FRAME } from "../../globals"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { getAnimationStates } from "../../display/core/AnimatedObjectManager/AnimationStates"

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

const setAnimation = (
    self: AnimatedObjectManager,
    val?: string | number | boolean | AnimationValue
) => {
    self.$animation = val

    if (typeof val === "string" || typeof val === "number") {
        addConfigAnimationManagerSystem(self, { name: val })
        return
    }
    if (typeof val === "boolean") {
        if (val)
            addConfigAnimationManagerSystem(self, {
                name: 0
            })
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
    addConfigAnimationManagerSystem(self, { name })
}

export const [addConfigAnimationSystem] = configSystemWithCleanUp(
    (self: AnimatedObjectManager) => {
        const val = self.$animation
        if (Array.isArray(val)) {
            const animationStates = getAnimationStates(self)
            const finishEvent = (animationStates.finishEvent = event())

            let currentIndex = 0
            const next = () => {
                if (currentIndex === val.length) {
                    if (self.animationRepeat < 2) {
                        self.onAnimationFinish?.()
                        return
                    }
                    currentIndex = 0
                }
                setAnimation(self, val[currentIndex++])
            }
            next()
            const [, onFinish] = finishEvent
            const handle = onFinish(next)

            return () => {
                animationStates.finishEvent = undefined
                handle.cancel()
            }
        }
        setAnimation(self, val)
    }
)
