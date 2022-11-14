import { Reactive } from "@lincode/reactivity"
import ITimeline from "../interface/ITimeline"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"

export default class Timeline extends AnimationManager implements ITimeline {
    public constructor(name: string) {
        const repeatState = new Reactive<number>(0)
        const onFinishState = new Reactive<(() => void) | undefined>(undefined)
        super(name, undefined, undefined, repeatState, onFinishState)
    }
}
