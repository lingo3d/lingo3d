import { emitKeyPress } from "../events/onKeyPress"
import createInternalSystem from "./utils/createInternalSystem"

export const keyPressEmitSystem = createInternalSystem("keyPressEmitSystem", {
    update: (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
})
