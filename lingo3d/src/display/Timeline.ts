import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { AnimationData } from "../api/serializer/types"
import ITimeline, {
    timelineDefaults,
    timelineSchema
} from "../interface/ITimeline"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"

export default class Timeline extends Appendable implements ITimeline {
    public static componentName = "timeline"
    public static defaults = timelineDefaults
    public static schema = timelineSchema

    private animationManager = new AnimationManager(
        "timeline",
        undefined,
        this,
        new Reactive(0),
        new Reactive<(() => void) | undefined>(undefined)
    )

    public setData(data: AnimationData) {
        this.animationManager.setData(data)
    }
}
