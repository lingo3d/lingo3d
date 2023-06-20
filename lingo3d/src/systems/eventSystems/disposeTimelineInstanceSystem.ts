import Appendable from "../../display/core/Appendable"
import { onDispose } from "../../events/onDispose"
import { timelineDataPtr } from "../../pointers/timelineDataPtr"
import { timelinePtr } from "../../pointers/timelinePtr"
import createInternalSystem from "../utils/createInternalSystem"

export const disposeTimelineInstanceSystem = createInternalSystem(
    "disposeTimelineInstanceSystem",
    {
        update: (timelineInstances: WeakSet<Appendable>, _, payload) => {
            if (!timelineInstances.has(payload)) return
            delete timelineDataPtr[0]![payload.uuid]
            timelinePtr[0]!.data = timelineDataPtr[0]
        },
        updateTicker: onDispose
    }
)
