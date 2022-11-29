import store from "@lincode/reactivity"

const [setTimelineExpandedUUIDs, getTimelineExpandedUUIDs] = store([
    new Set<string>()
])
export { getTimelineExpandedUUIDs }
export const addTimelineExpandedUUID = (uuid: string) => {
    const [expandedUUIDs] = getTimelineExpandedUUIDs()
    expandedUUIDs.add(uuid)
    setTimelineExpandedUUIDs([expandedUUIDs])
}
export const deleteTimelineExpandedUUID = (uuid: string) => {
    const [expandedUUIDs] = getTimelineExpandedUUIDs()
    expandedUUIDs.delete(uuid)
    setTimelineExpandedUUIDs([expandedUUIDs])
}
