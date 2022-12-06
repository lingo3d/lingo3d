import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import { timelineScrollTopSignal } from "../../states/useTimelineScrollTop"
import FrameTweenRow from "./FrameTweenRow"

type FrameTweensProps = {
    keyframesEntries: Array<[string, Record<number, true>]>
}

const FrameTweens = ({ keyframesEntries }: FrameTweensProps) => {
    return (
        <div
            style={{
                position: "absolute",
                left: -timelineScrollLeftSignal.value,
                top: -timelineScrollTopSignal.value
            }}
        >
            {keyframesEntries.map(([uuid, frames]) => (
                <FrameTweenRow key={uuid} uuid={uuid} frames={frames} />
            ))}
        </div>
    )
}

export default FrameTweens
