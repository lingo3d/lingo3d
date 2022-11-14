import { Reactive } from "@lincode/reactivity"
import ITimeline, { timelineDefaults, timelineSchema } from "../interface/ITimeline"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"

export default class Timeline extends AnimationManager implements ITimeline {
    public static override componentName = "timeline"
    public static override defaults = timelineDefaults
    public static override schema = timelineSchema

    public constructor(name: string) {
        const repeatState = new Reactive<number>(0)
        const onFinishState = new Reactive<(() => void) | undefined>(undefined)
        super(name, undefined, undefined, repeatState, onFinishState)
    }
}
