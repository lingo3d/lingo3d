import { emitKeyPress } from "../events/onKeyPress"
import createSystem from "./utils/createSystem"

export const keyPressEmitSystem = createSystem({
    update: (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
})
