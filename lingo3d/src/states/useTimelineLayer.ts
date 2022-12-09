import store, { createEffect } from "@lincode/reactivity"
import { getSelectionTarget } from "./useSelectionTarget"

export const [setTimelineLayer, getTimelineLayer] = store<string | undefined>(
    undefined
)

createEffect(() => {
    const target = getSelectionTarget()
    const layer = getTimelineLayer()
    if (!layer && target) setTimelineLayer(target.uuid)
    else if (layer && !target) setTimelineLayer(undefined)
    else if (layer && target && layer.split(" ")[0] !== target.uuid)
        setTimelineLayer(target.uuid)
}, [getTimelineLayer, getSelectionTarget])
