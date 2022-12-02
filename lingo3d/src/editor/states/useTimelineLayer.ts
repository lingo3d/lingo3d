import store from "@lincode/reactivity"

export const [setTimelineLayer, getTimelineLayer] = store<string | undefined>(
    undefined
)
