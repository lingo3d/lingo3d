import { emitKeyPress } from "../events/onKeyPress"
import createSystem from "./utils/createInternalSystem"

export const keyPressEmitSystem = createSystem("keyPressEmitSystem", {
    update: (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
})
