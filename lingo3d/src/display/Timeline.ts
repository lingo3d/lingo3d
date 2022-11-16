import { Reactive } from "@lincode/reactivity"
import { PropertyBinding } from "three"
import Appendable from "../api/core/Appendable"
import { uuidMap } from "../api/core/collections"
import { AnimationData } from "../api/serializer/types"
import ITimeline, {
    timelineDefaults,
    timelineSchema
} from "../interface/ITimeline"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"

const findNode = PropertyBinding.findNode
PropertyBinding.findNode = (root, nodeName) => {
    if (uuidMap.has(nodeName)) return uuidMap.get(nodeName)
    return findNode(root, nodeName)
}

export default class Timeline extends Appendable implements ITimeline {
    public static componentName = "timeline"
    public static defaults = timelineDefaults
    public static schema = timelineSchema

    private animationManager = new AnimationManager(
        "timeline",
        undefined,
        {},
        new Reactive(0),
        new Reactive<(() => void) | undefined>(undefined)
    )

    public setData(data: AnimationData) {
        this.animationManager.setData(data)
        this.animationManager.paused = false
    }
}
