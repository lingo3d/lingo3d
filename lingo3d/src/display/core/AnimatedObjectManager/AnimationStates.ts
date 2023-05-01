import { EventFunctions } from "@lincode/events"
import { Reactive, createEffect } from "@lincode/reactivity"
import type AnimationManager from "./AnimationManager"
import type AnimatedObjectManager from "."

export default class AnimationStates {
    public managerRecordState = new Reactive<Record<string, AnimationManager>>(
        {}
    )
    public managerState = new Reactive<AnimationManager | undefined>(undefined)
    public pausedState = new Reactive(false)
    public repeatState = new Reactive(Infinity)
    public onFinishState = new Reactive<(() => void) | undefined>(undefined)
    public finishEventState = new Reactive<EventFunctions | undefined>(
        undefined
    )

    public constructor(manager: AnimatedObjectManager) {
        manager.watch(
            createEffect(() => {
                const manager = this.managerState.get()
                if (manager) manager.paused = this.pausedState.get()
            }, [this.managerState.get, this.pausedState.get])
        )
    }
}
