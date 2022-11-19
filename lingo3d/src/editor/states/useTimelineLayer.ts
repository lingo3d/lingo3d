import preactStore from "../utils/preactStore"

export const [useTimelineLayer, setTimelineLayer, getTimelineLayer] =
    preactStore<string | undefined>(undefined)
