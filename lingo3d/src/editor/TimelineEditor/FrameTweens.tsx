import useSyncState from "../hooks/useSyncState"
import { getTimelineScrollLeft } from "../states/useTimelineScrollLeft"
import FrameTweenRow from "./FrameTweenRow"

type FrameTweensProps = {
    keyframesEntries: Array<[string, Record<number, true>]>
}

const FrameTweens = ({ keyframesEntries }: FrameTweensProps) => {
    const scrollLeft = useSyncState(getTimelineScrollLeft)

    return (
        <div
            style={{
                position: "absolute",
                left: -scrollLeft
            }}
        >
            {keyframesEntries.map(([uuid, frames]) => (
                <FrameTweenRow key={uuid} uuid={uuid} frames={frames} />
            ))}
        </div>
    )
}

export default FrameTweens
