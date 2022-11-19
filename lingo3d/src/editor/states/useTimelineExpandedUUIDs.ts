import preactStore from "../utils/preactStore"

const [
    useTimelineExpandedUUIDs,
    setTimelineExpandedUUIDs,
    getTimelineExpandedUUIDs
] = preactStore([new Set<string>()])
export { useTimelineExpandedUUIDs }
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
