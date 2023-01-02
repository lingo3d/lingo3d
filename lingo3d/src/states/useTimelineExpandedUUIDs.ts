import store, { add, remove } from "@lincode/reactivity"

const [setTimelineExpandedUUIDs, getTimelineExpandedUUIDs] = store([
    new Set<string>()
])
export { getTimelineExpandedUUIDs }
export const addTimelineExpandedUUID = add(
    setTimelineExpandedUUIDs,
    getTimelineExpandedUUIDs
)
export const deleteTimelineExpandedUUID = remove(
    setTimelineExpandedUUIDs,
    getTimelineExpandedUUIDs
)
