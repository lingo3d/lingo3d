import { timelineScrollLeftSignal } from "../../states/useTimelineScrollLeft"
import FrameTweenRow from "./FrameTweenRow"

type FrameTweensProps = {
    keyframesEntries: Array<[string, Record<number, true>]>
}

const FrameTweens = ({ keyframesEntries }: FrameTweensProps) => {
    return (
        <div
            style={{
                position: "absolute",
                left: -timelineScrollLeftSignal.value
            }}
        >
            {keyframesEntries.map(([uuid, frames]) => (
                <FrameTweenRow key={uuid} uuid={uuid} frames={frames} />
            ))}
        </div>
    )
}

export default FrameTweens
