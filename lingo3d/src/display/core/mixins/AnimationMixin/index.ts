import { AnimationData } from "../../../../api/serializer/types"
import IAnimationMixin, { Animation, AnimationValue } from "../../../../interface/IAnimationMixin"
import { debounce } from "@lincode/utils"
import { Resolvable } from "@lincode/promiselikes"
import AnimationManager, { PlayOptions } from "./AnimationManager"
import EventLoopItem from "../../../../api/core/EventLoopItem"
import Nullable from "../../../../interface/utils/Nullable"

const buildAnimationTracks = debounce((val: AnimationValue) => {
    const entries = Object.entries(val)
    let maxLength = 0
    for (const [, { length }] of entries)
        length > maxLength && (maxLength = length)

    const duration = 1000
    const timeStep = duration * 0.001 / maxLength

    const result: AnimationData = {}
    for (const [name, values] of entries)
        result[name] = Object.fromEntries(values.map((v, i) => [(i * timeStep).toFixed(2), v]))

    return result

}, 0, "trailingPromise")

export default abstract class AnimationMixin extends EventLoopItem implements IAnimationMixin {
    public animationManagers?: Record<string, AnimationManager>
    
    public get animations() {
        return this.animationManagers ??= {}
    }
    public set animations(val: Record<string, AnimationManager>) {
        this.animationManagers = val
    }

    private createAnimation(name: string): AnimationManager {
        if (name in this.animations) {
            const animation = this.animations[name]
            if (typeof animation !== "string")
                return animation
        }
        const animation = this.watch(new AnimationManager(name, this))
        this.animations[name] = animation
        
        return animation
    }

    private buildAnimation(val: AnimationValue) {
        buildAnimationTracks(val).then(tracks => {
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

    protected loadingAnims?: Array<Resolvable>
    private async loadingAnimsAsync() {
        await new Promise(resolve => setTimeout(resolve))
        
        if (this.loadingAnims) {
            await Promise.all(this.loadingAnims)
            this.loadingAnims = undefined
        }
    }

    private animationManager?: AnimationManager

    public get animationPaused() {
        return this.animationManager?.getPaused()
    }
    public set animationPaused(value: boolean | undefined) {
        this.loadingAnimsAsync().then(() => {
            if (this.done) return
            this.animationManager?.setPaused(!!value)
        })
    }
    
    public animationRepeat: Nullable<boolean>
    
    public onAnimationFinish: Nullable<() => void>

    public async playAnimation(name?: string | number, o?: PlayOptions) {
        await this.loadingAnimsAsync()
        if (this.done) return

        this.animationManager = typeof name === "string"
            ? this.animations[name]
            : Object.values(this.animations)[name ?? 0]

        this.animationManager?.play(o)
    }

    public async stopAnimation() {
        await this.loadingAnimsAsync()
        if (this.done) return

        this.animationManager?.stop()
    }

    protected animationName?: string | number
    private setAnimation(val?: string | number | boolean | AnimationValue, o?: PlayOptions) {
        this._animation = val

        if (typeof val === "string" || typeof val === "number") {
            this.animationName = val
            this.playAnimation(val, o)
            return
        }
        if (typeof val === "boolean") {
            val ? this.playAnimation(undefined, o) : this.stopAnimation()
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
            const o = {
                onFinish: () => {
                    if (++currentIndex >= val.length) {
                        if (this.animationRepeat === false) {
                            this.onAnimationFinish?.()
                            return
                        }
                        currentIndex = 0
                    }
                    this.setAnimation(val[currentIndex], o)
                },
                repeat: false
            }
            this.setAnimation(val[0], o)
            return
        }
        this.queueMicrotask(() => this.setAnimation(val, {
            repeat: this.animationRepeat, onFinish: this.onAnimationFinish
        }))
    }
}