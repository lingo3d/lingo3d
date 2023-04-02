import { emitKeyPress } from "../events/onKeyPress"
import renderSystem from "./utils/renderSystem"

export const [addKeyPressSystem, deleteKeyPressSystem] = renderSystem(
    (keyPressSet: Set<string>) => keyPressSet.size && emitKeyPress()
)
