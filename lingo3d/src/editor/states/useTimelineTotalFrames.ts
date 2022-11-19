import preactStore from "../utils/preactStore"

export const [useTimelineTotalFrames, , getTimelineTotalFrames] = preactStore(
    Number.MAX_SAFE_INTEGER
)
