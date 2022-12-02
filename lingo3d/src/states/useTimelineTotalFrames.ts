import store from "@lincode/reactivity"

export const [setTimelineTotalFrames, getTimelineTotalFrames] = store(
    Number.MAX_SAFE_INTEGER
)
