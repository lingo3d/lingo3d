import { emitKeyPress } from "../events/onKeyPress"
import createSystem from "./utils/createSystem"

export const keyPressEmitSystem = createSystem("keyPressEmitSystem", {
    update: (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
})
