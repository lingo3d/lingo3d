import useSyncState from "../hooks/useSyncState"
import { getTimelineKeyframeEntries } from "../../states/useTimelineKeyframeEntries"
import FrameTweens from "./FrameTweens"

const Frames = () => {
    const keyframesEntries = useSyncState(getTimelineKeyframeEntries)

    return (
        <div className="lingo3d-absfull" style={{ overflow: "hidden" }}>
            <FrameTweens keyframesEntries={keyframesEntries} />
        </div>
    )
}

export default Frames
