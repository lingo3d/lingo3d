import EventLoopItem from "../../../api/core/EventLoopItem"
import AnimationManager, { PlayOptions } from "./AnimationManager"
import { AnimationData } from "../../utils/deserialize/types"
import guid from "@pinyinma/guid"
import IAnimation, { AnimationValue } from "../../../interface/IAnimation"
import { debounce } from "@lincode/utils"

const buildAnimationTracks = (val: AnimationValue) => {
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
}

export default abstract class AnimationItem extends EventLoopItem implements IAnimation {
    protected animationManagers?: Record<string, AnimationManager>
    
    public get animations() {
        return this.animationManagers ??= {}
    }
    public set animations(val: Record<string, AnimationManager>) {
        this.animationManagers = val
    }

    public createAnimation(name: string): AnimationManager {
        if (name in this.animations) {
            const animation = this.animations[name]
            if (typeof animation !== "string")
                return animation
        }
        const animation = this.watch(new AnimationManager(name, this))
        this.animations[name] = animation
        
        return animation
    }

    protected animationPromises?: Array<Promise<void>>
    private animationManager?: AnimationManager

    public async playAnimation(name?: string, o?: PlayOptions) {
        this.animationPromises && await Promise.all(this.animationPromises)

        this.animationManager = name
            ? this.animations[name]
            : Object.values(this.animations)[0]

        this.animationManager?.play(o)
    }

    public stopAnimation() {
        this.animationManager?.stop()
    }

    private _animation?: AnimationValue
    private _animationProxy?: AnimationValue
    public get animation(): AnimationValue {
        this._animation ??= {}

        const buildAnimationTracksDebounced = debounce(buildAnimationTracks, 0, "trailingPromise")

        return this._animationProxy ??= new Proxy({}, {
            get: (_, prop: string) => {
                return this._animation![prop]
            },
            set: (_, prop: string, value) => {
                this._animation![prop] = value

                buildAnimationTracksDebounced(this._animation!).then(tracks => {
                    const name = guid + "animation"
                    this.createAnimation(name).setTracks(tracks)
                    this.playAnimation(name)
                })
                return true
            }
        })
    }
    public set animation(val: string | AnimationValue | undefined) {
        if (typeof val === "string") {
            this.playAnimation(val)
            this._animation = undefined
            return
        }
        this._animation = val

        if (!val) {
            this.stopAnimation()
            return
        }
        const tracks = buildAnimationTracks(val)
        const name = guid + "animation"
        this.createAnimation(name).setTracks(tracks)
        this.playAnimation(name)
    }
}