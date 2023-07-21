import { onSession } from "../../events/onSession"
import createInternalSystem from "../utils/createInternalSystem"

export const unloadClearCollectionSystem = createInternalSystem(
    "unloadClearCollectionSystem",
    {
        update: (self: Set<any> | Map<any, any> | Array<any>) => {
            "clear" in self ? self.clear() : (self.length = 0)
        },
        updateTicker: onSession
    }
)
