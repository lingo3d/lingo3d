import { useState, useEffect } from "preact/hooks"
import { AnimationData } from "../../api/serializer/types"
import { useTimeline } from "../states"

export default () => {
    const [timeline] = useTimeline()
    const [timelineDataWrapper, setTimelineDataWrapper] = useState<
        [AnimationData | undefined]
    >([undefined])

    useEffect(() => {
        if (!timeline) return
        //@ts-ignore
        const handle = timeline.dataState.get((data) =>
            setTimelineDataWrapper(data)
        )
        return () => {
            setTimelineDataWrapper([undefined])
            handle.cancel()
        }
    }, [timeline])

    return timelineDataWrapper
}
