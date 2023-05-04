import { AnimationMixer, AnimationClip, AnimationAction } from "three"
import { assert, forceGetInstance, merge } from "@lincode/utils"
import IAnimationManager, {
    AnimationData,
    animationManagerDefaults,
    animationManagerSchema
} from "../../../interface/IAnimationManager"
import Appendable from "../../../api/core/Appendable"
import FoundManager from "../FoundManager"
import { STANDARD_FRAME } from "../../../globals"
import AnimationStates from "./AnimationStates"
import { addConfigAnimationDataSystem } from "../../../systems/configSystems/configAnimationDataSystem"
import getClipAction from "../../../utilsCached/getClipAction"

const targetMixerMap = new WeakMap<object, AnimationMixer>()

export default class AnimationManager
    extends Appendable
    implements IAnimationManager
{
    public static componentName = "animation"
    public static defaults = animationManagerDefaults
    public static schema = animationManagerSchema

    private _clip?: AnimationClip
    public get $clip() {
        return this._clip
    }
    public set $clip(val) {
        assert(val && !this._clip)
        this._clip = val
        this.$action = getClipAction(this.$mixer, val)
    }

    private _action?: AnimationAction
    public get $action() {
        return this._action
    }
    public set $action(val) {
        assert(val && !this._action)
        this._action = val
    }

    public get $pausedCount() {
        return this.animationStates.pausedCount
    }
    public set $pausedCount(val) {
        this.animationStates.pausedCount = val
    }

    public get paused() {
        return this.animationStates.paused
    }
    public set paused(val) {
        this.animationStates.paused = val
    }

    public $mixer: AnimationMixer

    public clipTotalFrames = 0
    public audioTotalFrames = 0
    public get totalFrames() {
        return Math.max(this.clipTotalFrames, this.audioTotalFrames)
    }

    public constructor(
        name: string | undefined,
        public $loadedClip: AnimationClip | undefined,
        target: object | undefined,
        public animationStates: AnimationStates
    ) {
        super()
        this.disableSerialize = true
        this.name = name
        addConfigAnimationDataSystem(this)
        this.$mixer = forceGetInstance(
            targetMixerMap,
            target ?? this,
            AnimationMixer,
            [target]
        )
    }

    public retarget(target: FoundManager, animationStates: AnimationStates) {
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
        addConfigAnimationDataSystem(this)
    }

    public mergeData(data: AnimationData) {
        if (!this.data) {
            this.data = data
            return
        }
        merge(this.data, data)
        this.data = this.data
    }

    public get frame() {
        return Math.ceil(this.$mixer.time * STANDARD_FRAME)
    }
    public set frame(val) {
        this.animationStates.gotoFrame = val
    }
}
