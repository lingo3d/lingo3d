import { EventFunctions } from "@lincode/events"
import { Reactive } from "@lincode/reactivity"
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

    public repeatState = new Reactive(Infinity)
    public onFinishState = new Reactive<(() => void) | undefined>(undefined)
    public finishEventState = new Reactive<EventFunctions | undefined>(
        undefined
    )
}

const animationStatesMap = new WeakMap<AnimatedObjectManager, AnimationStates>()

export const getAnimationStates = (self: AnimatedObjectManager) =>
    forceGetInstance(animationStatesMap, self, AnimationStates)
