import { EventFunctions } from "@lincode/events"
import type AnimationManager from "./AnimationManager"
import { addConfigAnimationStatesSystem } from "../../../systems/configSystems/configAnimationStatesSystem"
import AnimatedObjectManager from "."
import { forceGetInstance } from "@lincode/utils"

export default class AnimationStates {
    public managerRecord: Record<string, AnimationManager> = {}

    private _manager: AnimationManager | undefined
    public get manager() {
        return this._manager
    }
    public set manager(val) {
        this._manager = val
        addConfigAnimationStatesSystem(this)
    }

    private _paused = false
    public get paused() {
        return this._paused
    }
    public set paused(val) {
        this._paused = val
        addConfigAnimationStatesSystem(this)
    }

    private _repeat = Infinity
    public get repeat() {
        return this._repeat
    }
    public set repeat(val) {
        this._repeat = val
        addConfigAnimationStatesSystem(this)
    }

    private _onFinish?: () => void
    public get onFinish() {
        return this._onFinish
    }
    public set onFinish(val) {
        this._onFinish = val
        addConfigAnimationStatesSystem(this)
    }

    private _finishEvent?: EventFunctions
    public get finishEvent() {
        return this._finishEvent
    }
    public set finishEvent(val) {
        this._finishEvent = val
        addConfigAnimationStatesSystem(this)
    }
}

const animationStatesMap = new WeakMap<AnimatedObjectManager, AnimationStates>()

export const getAnimationStates = (self: AnimatedObjectManager) =>
    forceGetInstance(animationStatesMap, self, AnimationStates)
