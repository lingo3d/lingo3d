import { onUnload } from "../../events/onUnload"
import createInternalSystem from "../utils/createInternalSystem"

export const unloadClearCollectionSystem = createInternalSystem(
    "unloadClearCollectionSystem",
    {
        update: (self: Set<any> | Map<any, any>) => self.clear(),
        updateTicker: onUnload
    }
)
