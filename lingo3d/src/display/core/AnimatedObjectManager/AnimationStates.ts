import type AnimationManager from "./AnimationManager"
import { addConfigAnimationPlaybackSystem } from "../../../systems/configSystems/configAnimationPlaybackSystem"

export default class AnimationStates {
    public managerRecord: Record<string, AnimationManager> = {}

    private _manager: AnimationManager | undefined
    public get manager() {
        return this._manager
    }
    public set manager(val) {
        this._manager = val
        addConfigAnimationPlaybackSystem(this)
    }

    private _pausedCount = 0
    public get pausedCount() {
        return this._pausedCount
    }
    public set pausedCount(val) {
        this._pausedCount = val
        addConfigAnimationPlaybackSystem(this)
    }

    private _gotoFrame?: number
    public get gotoFrame() {
        return this._gotoFrame
    }
    public set gotoFrame(val) {
        this._gotoFrame = val
        addConfigAnimationPlaybackSystem(this)
    }
}
