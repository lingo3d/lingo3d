import Timeline from "../../display/Timeline"
import preactStore from "../utils/preactStore"

export const [useScrollLeft] = preactStore(0)
export const [useFrameNum] = preactStore(1000)
export const [useTimeline, setTimeline] = preactStore<Timeline | undefined>(
    undefined
)
