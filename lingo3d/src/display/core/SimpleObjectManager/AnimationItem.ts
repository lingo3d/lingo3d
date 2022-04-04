import EventLoopItem from "../../../api/core/EventLoopItem"
import AnimationManager, { PlayOptions } from "./AnimationManager"
import { AnimationData } from "../../utils/deserialize/types"
import guid from "@pinyinma/guid"
import IAnimation, { Animation, AnimationValue } from "../../../interface/IAnimation"
import { debounce } from "@lincode/utils"
import { Resolvable } from "@lincode/promiselikes"

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

export default abstract class AnimationItem extends EventLoopItem implements IAnimation {
    protected animationManagers?: Record<string, AnimationManager>
    
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
            const name = guid + "animation"
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
    private animationManager?: AnimationManager

    public async playAnimation(name?: string | number, o?: PlayOptions) {
        await Promise.resolve()

        if (this.loadingAnims) {
            await Promise.all(this.loadingAnims)
            this.loadingAnims = undefined
        }

        if (this.done) return

        this.animationManager = typeof name === "string"
            ? this.animations[name]
            : Object.values(this.animations)[name ?? 0]

        this.animationManager?.play(o)
    }

    public stopAnimation() {
        this.animationManager?.stop()
    }

    private setAnimation(val?: string | number | boolean | AnimationValue, o?: PlayOptions) {
        if (typeof val === "string" || typeof val === "number") {
            this.playAnimation(val, o)
            this._animation = undefined
            return
        }
        if (typeof val === "boolean") {
            val ? this.playAnimation(undefined, o) : this.stopAnimation()
            this._animation = undefined
            return
        }
        this._animation = val

        if (!val) {
            this.stopAnimation()
            return
        }
        this._animation = this.makeAnimationProxy(val)
        this.buildAnimation(val)
    }

    private _animation?: AnimationValue
    public get animation(): AnimationValue {
        return this._animation ??= this.makeAnimationProxy({})
    }
    public set animation(val: Animation | undefined) {
        if (Array.isArray(val)) {
            let currentIndex = 0
            const o = {
                onFinish: () => {
                    if (++currentIndex >= val.length) currentIndex = 0
                    this.setAnimation(val[currentIndex], o)
                },
                repeat: false
            }
            this.setAnimation(val[0], o)
            return
        }
        
        this.setAnimation(val)
    }
}