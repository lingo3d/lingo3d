import { emitKeyPress } from "../events/onKeyPress"
import gameSystem from "./utils/gameSystem"

export const keyPressEmitSystem = gameSystem({
    update: (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
})
