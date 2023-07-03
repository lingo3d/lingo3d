import { AnimationMixer, AnimationClip, AnimationAction } from "three"
import { forceGetInstance, merge } from "@lincode/utils"
import IAnimationManager, {
    AnimationData,
    animationManagerDefaults,
    animationManagerSchema
} from "../../../interface/IAnimationManager"
import Appendable from "../Appendable"
import FoundManager from "../FoundManager"
import { STANDARD_FRAME } from "../../../globals"
import AnimationStates from "./AnimationStates"
import getClipAction from "../../../memo/getClipAction"
import { configAnimationDataSystem } from "../../../systems/configSystems/configAnimationDataSystem"
import { configAnimationPlaybackSystem } from "../../../systems/configSystems/configAnimationPlaybackSystem"

const targetMixerMap = new WeakMap<object, AnimationMixer>()

export default class AnimationManager
    extends Appendable
    implements IAnimationManager
{
    public static componentName = "animation"
    public static defaults = animationManagerDefaults
    public static schema = animationManagerSchema

    public $action?: AnimationAction
    public $mixer: AnimationMixer

    private _clip?: AnimationClip
    public get $clip() {
        return this._clip
    }
    public set $clip(val) {
        if (this._clip) {
            this.$action?.stop()
            this.$mixer.uncacheClip(this._clip)
        }
        this._clip = val
        if (val) this.$action = getClipAction(this.$mixer, val)
        configAnimationPlaybackSystem.add(this.$animationStates)
        this.lastFrame = val ? Math.ceil(val.duration * STANDARD_FRAME) : 0
    }

    public get paused() {
        return (
            this.$animationStates.paused ||
            this.$animationStates.manager !== this
        )
    }
    public set paused(val) {
        if (!val) this.$animationStates.manager = this
        this.$animationStates.paused = val
    }

    public get loop() {
        return this.$animationStates.loop
    }
    public set loop(val) {
        this.$animationStates.loop = val
    }

    public lastFrame = 0

    public constructor(
        name: string | undefined,
        public $loadedClip: AnimationClip | undefined,
        target: object | undefined,
        public $animationStates: AnimationStates
    ) {
        super()
        this.$disableSerialize = true
        this.name = name
        configAnimationDataSystem.add(this)
        this.$mixer = forceGetInstance(
            targetMixerMap,
            target ?? this,
            AnimationMixer,
            [target]
        )
    }

    public inherit(target: FoundManager, animationStates: AnimationStates) {
        const newClip = this.$clip?.clone()
        if (!newClip) return this

        const targetName = target.name + "."
        newClip.tracks = newClip.tracks.filter((track) =>
            track.name.startsWith(targetName)
        )
        const animation = new AnimationManager(
            this.name,
            newClip,
            target,
            animationStates
        )
        target.append(animation)
        return animation
    }

    private _data?: AnimationData
    public get data() {
        return this._data
    }
    public set data(val: AnimationData | undefined) {
        this._data = val
        configAnimationDataSystem.add(this)
    }

    public mergeData(data: AnimationData) {
        if (!this.data) {
            this.data = data
            return
        }
        merge(this.data, data)
        this.data = { ...this.data }
    }

    public get frame() {
        return Math.ceil(this.$mixer.time * STANDARD_FRAME)
    }
    public set frame(val) {
        this.$animationStates.gotoFrame = val
    }
}
