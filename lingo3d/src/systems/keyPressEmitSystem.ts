import { emitKeyPress } from "../events/onKeyPress"
import renderSystem from "./utils/renderSystem"

export const [addKeyPressEmitSystem, deleteKeyPressEmitSystem] = renderSystem(
    (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
)
