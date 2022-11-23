import preactStore from "../utils/preactStore"
import { AnimationData } from "../../api/serializer/types"
import { createEffect } from "@lincode/reactivity"
import { getTimeline } from "../../states/useTimeline"

export const [useTimelineData, setTimelineData, getTimelineData] = preactStore<
    [AnimationData | undefined]
>([undefined])

createEffect(() => {
    const timeline = getTimeline()
    if (!timeline) return

    //@ts-ignore
    const handle = timeline.dataState.get(setTimelineData)
    return () => {
        handle.cancel()
        setTimelineData([undefined])
    }
}, [getTimeline])
