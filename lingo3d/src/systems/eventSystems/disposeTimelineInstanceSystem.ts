import Appendable from "../../display/core/Appendable"
import { onDispose } from "../../events/onDispose"
import { timelineDataPtr } from "../../pointers/timelineDataPtr"
import { timelinePtr } from "../../pointers/timelinePtr"
import eventSimpleSystem from "../utils/eventSimpleSystem"

export const [
    addDisposeTimelineInstanceSystem,
    deleteDisposeTimelineInstanceSystem
] = eventSimpleSystem((timelineInstances: WeakSet<Appendable>, payload) => {
    if (!timelineInstances.has(payload)) return
    delete timelineDataPtr[0]![payload.uuid]
    timelinePtr[0]!.data = timelineDataPtr[0]
}, onDispose)
