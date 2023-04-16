import { Reactive } from "@lincode/reactivity"
import { PropertyBinding } from "three"
import ITimeline, {
    timelineDefaults,
    timelineSchema
} from "../interface/ITimeline"
import AnimationManager from "./core/AnimatedObjectManager/AnimationManager"
import { uuidMap } from "../collections/uuidCollections"

const findNode = PropertyBinding.findNode
PropertyBinding.findNode = (root, nodeName) => {
    if (uuidMap.has(nodeName)) return uuidMap.get(nodeName)
    return findNode(root, nodeName)
}

export default class Timeline extends AnimationManager implements ITimeline {
    public static override componentName = "timeline"
    public static override defaults = timelineDefaults
    public static override schema = timelineSchema

    public constructor() {
        super(
            "",
            undefined,
            {},
            new Reactive(0),
            new Reactive<(() => void) | undefined>(undefined)
        )
        this.disableSerialize = false
    }
}
