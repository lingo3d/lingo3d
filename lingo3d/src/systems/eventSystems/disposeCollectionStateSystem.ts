import { onDispose } from "../../events/onDispose"
import eventSimpleSystemWithData from "../utils/eventSimpleSystemWithData"

export const [
    addDisposeCollectionStateSystem,
    deleteDisposeCollectionStateSystem
] = eventSimpleSystemWithData(
    (
        collection: Set<any>,
        data: { deleteState: (val: any) => void },
        payload
    ) => collection.has(payload) && data.deleteState(payload),
    onDispose
)
