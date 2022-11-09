import { debounce } from "@lincode/utils"
import { Object3D } from "three"
import { AnimationData } from "../../../api/serializer/types"
import IAnimatedObjectManager, {
    Animation,
    AnimationValue
} from "../../../interface/IAnimatedObjectManager"
import Nullable from "../../../interface/utils/Nullable"
import AnimationManager from "./AnimationManager"
import StaticObjectManager from "../StaticObjectManager"

const buildAnimationTracks = debounce(
    (val: AnimationValue) => {
        const entries = Object.entries(val)
        let maxLength = 0
        for (const [, { length }] of entries)
            length > maxLength && (maxLength = length)

        const duration = 1000
        const timeStep = (duration * 0.001) / maxLength

        const result: AnimationData = {}
        for (const [name, values] of entries)
            result[name] = Object.fromEntries(
                values.map((v, i) => [(i * timeStep).toFixed(2), v])
            )

        return result
    },
    0,
    "trailingPromise"
)

export default class AnimatedObjectManager<T extends Object3D = Object3D>
    extends StaticObjectManager<T>
    implements IAnimatedObjectManager
{
    public animationManagers?: Record<string, AnimationManager>

    public get animations() {
        return (this.animationManagers ??= {})
    }
    public set animations(val) {
        this.animationManagers = val
    }

    private createAnimation(name: string): AnimationManager {
        if (name in this.animations) {
            const animation = this.animations[name]
            if (typeof animation !== "string") return animation
        }
        const animation = this.watch(new AnimationManager(name, this))
        this.animations[name] = animation

        return animation
    }

    private buildAnimation(val: AnimationValue) {
        buildAnimationTracks(val).then((tracks) => {
            const name = "lingo3d-animation"
            this.createAnimation(name).setTracks(tracks)
            this.playAnimation(name)
        })
    }

    private makeAnimationProxy(source: AnimationValue) {
        return new Proxy(source, {
            get: (anim, prop: string) => {
                return anim[prop]
            },
            set: (anim, prop: string, value) => {
                anim[prop] = value
                this.buildAnimation(anim)
                return true
            }
        })
    }

    private animationManager?: AnimationManager

    public get animationPaused() {
        return this.animationManager?.paused
    }
    public set animationPaused(value) {
        if (this.animationManager) this.animationManager.paused = !!value
    }

    public animationRepeat: Nullable<number>

    public onAnimationFinish: Nullable<() => void>

    public playAnimation(
        name?: string | number,
        repeat = Infinity,
        onFinish?: () => void
    ) {
        const manager = (this.animationManager =
            typeof name === "string"
                ? this.animations[name]
                : Object.values(this.animations)[name ?? 0])

        if (!manager) return

        manager.repeat = repeat
        manager.onFinish = onFinish
        manager.paused = false
    }

    public stopAnimation() {
        if (this.animationManager) this.animationManager.paused = true
    }

    protected serializeAnimation?: string | number
    private setAnimation(
        val?: string | number | boolean | AnimationValue,
        repeat?: number,
        onFinish?: () => void
    ) {
        this._animation = val

        if (typeof val === "string" || typeof val === "number") {
            this.serializeAnimation = val
            this.playAnimation(val, repeat, onFinish)
            return
        }
        if (typeof val === "boolean") {
            val
                ? this.playAnimation(undefined, repeat, onFinish)
                : this.stopAnimation()
            return
        }

        if (!val) {
            this.stopAnimation()
            return
        }
        this._animation = this.makeAnimationProxy(val)
        this.buildAnimation(val)
    }

    private _animation?: Animation
    public get animation() {
        return this._animation
    }
    public set animation(val) {
        if (Array.isArray(val)) {
            let currentIndex = 0
            this.setAnimation(val[0], 0, () => {
                if (++currentIndex >= val.length) {
                    if (this.animationRepeat === 0) {
                        this.onAnimationFinish?.()
                        return
                    }
                    currentIndex = 0
                }
                this.setAnimation(val[currentIndex])
            })
            return
        }
        this.queueMicrotask(() =>
            this.setAnimation(val, this.animationRepeat, this.onAnimationFinish)
        )
    }
}
