import { configAnimationPlaybackSystem } from "../../../systems/configSystems/configAnimationPlaybackSystem"
import type AnimationManager from "./AnimationManager"

export default class AnimationStates {
    public managerRecord: Record<string, AnimationManager> = {}

    private _manager: AnimationManager | undefined
    public get manager() {
        return this._manager
    }
    public set manager(val) {
        this._manager = val
        configAnimationPlaybackSystem.add(this)
    }

    private _paused = false
    public get paused() {
        return this._paused
    }
    public set paused(val) {
        this._paused = val
        configAnimationPlaybackSystem.add(this)
    }

    private _loop: boolean | number = true
    public get loop() {
        return this._loop
    }
    public set loop(val) {
        this._loop = val
        configAnimationPlaybackSystem.add(this)
    }

    private _pausedCount = 0
    public get pausedCount() {
        return this._pausedCount
    }
    public set pausedCount(val) {
        this._pausedCount = val
        configAnimationPlaybackSystem.add(this)
    }

    private _gotoFrame?: number
    public get gotoFrame() {
        return this._gotoFrame
    }
    public set gotoFrame(val) {
        this._gotoFrame = val
        configAnimationPlaybackSystem.add(this)
    }
}
