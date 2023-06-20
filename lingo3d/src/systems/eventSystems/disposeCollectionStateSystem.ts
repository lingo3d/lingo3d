import { onDispose } from "../../events/onDispose"
import createInternalSystem from "../utils/createInternalSystem"

export const disposeCollectionStateSystem = createInternalSystem(
    "disposeCollectionStateSystem",
    {
        data: {} as { deleteState: (val: any) => void },
        update: (collection: Set<any>, data, payload) =>
            collection.has(payload) && data.deleteState(payload),
        updateTicker: onDispose
    }
)
