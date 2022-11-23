import { Object3D } from "three"
import IAnimatedObjectManager, {
    Animation,
    AnimationValue
} from "../../../interface/IAnimatedObjectManager"
import AnimationManager from "./AnimationManager"
import StaticObjectManager from "../StaticObjectManager"
import { Reactive } from "@lincode/reactivity"
import { Cancellable } from "@lincode/promiselikes"
import { event, EventFunctions } from "@lincode/events"
import { SEC2FRAME } from "../../../globals"
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
            values.map((v, i) => [Math.ceil(i * timeStep * SEC2FRAME), v])
        )
    return data
}

type States = {
    managerRecordState: Reactive<Record<string, AnimationManager>>
    managerState: Reactive<AnimationManager | undefined>
    pausedState: Reactive<boolean>
    repeatState: Reactive<number>
    onFinishState: Reactive<(() => void) | undefined>
    finishEventState: Reactive<EventFunctions | undefined>
}

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends StaticObjectManager<T>
    implements IAnimatedObjectManager
{
    private states?: States
    protected lazyStates() {
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
        return this.lazyStates().managerRecordState.get()
    }
    public set animations(val) {
        this.lazyStates().managerRecordState.set(val)
    }

    public get animationPaused() {
        return this.lazyStates().pausedState.get()
    }
    public set animationPaused(value) {
        this.lazyStates().pausedState.set(value)
    }

    public get animationRepeat() {
        return this.lazyStates().repeatState.get()
    }
    public set animationRepeat(value) {
        this.lazyStates().repeatState.set(value)
    }

    public get onAnimationFinish() {
        return this.lazyStates().onFinishState.get()
    }
    public set onAnimationFinish(value) {
        this.lazyStates().onFinishState.set(value)
    }

    protected playAnimation(name?: string | number) {
        const { managerState, pausedState } = this.lazyStates()
        pausedState.set(false)
        managerState.set(
            typeof name === "string"
                ? this.animations[name]
                : Object.values(this.animations)[name ?? 0]
        )
    }

    public stopAnimation() {
        this.lazyStates().pausedState.set(true)
    }

    private createAnimation(name: string): AnimationManager {
        let animation = this.animations[name]
        if (animation && typeof animation !== "string") return animation

        const { onFinishState, repeatState, finishEventState } =
            this.lazyStates()
        animation = this.watch(
            new AnimationManager(
                name,
                undefined,
                this,
                repeatState,
                onFinishState,
                finishEventState
            )
        )
        this.append(animation)
        this.animations[name] = animation
        return animation
    }

    protected get serializeAnimation() {
        return typeof this._animation !== "object" ? this._animation : undefined
    }

    private setAnimation(val?: string | number | boolean | AnimationValue) {
        this._animation = val

        if (typeof val === "string" || typeof val === "number") {
            this.playAnimation(val)
            return
        }
        if (typeof val === "boolean") {
            val ? this.playAnimation(undefined) : this.stopAnimation()
            return
        }
        if (!val) {
            this.stopAnimation()
            return
        }
        const name = "animation"
        const anim = this.createAnimation(name)
        anim.data = animationValueToData(val)
        this.playAnimation(name)
    }

    private _animation?: Animation
    public get animation() {
        return this._animation
    }
    public set animation(val) {
        this.cancelHandle(
            "playAnimation",
            Array.isArray(val)
                ? () => {
                      const { finishEventState } = this.lazyStates()
                      const finishEvent = event()
                      finishEventState.set(finishEvent)

                      let currentIndex = 0
                      const next = () => {
                          if (currentIndex === val.length) {
                              if (this.animationRepeat < 2) {
                                  this.onAnimationFinish?.()
                                  return
                              }
                              currentIndex = 0
                          }
                          this.setAnimation(val[currentIndex++])
                      }
                      next()
                      const [, onFinish] = finishEvent
                      const handle = onFinish(next)

                      return new Cancellable(() => {
                          finishEventState.set(undefined)
                          handle.cancel()
                      })
                  }
                : void this.setAnimation(val)
        )
    }
}
