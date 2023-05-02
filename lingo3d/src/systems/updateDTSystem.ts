import { dtPtr } from "../pointers/dtPtr"
import renderSystem from "./utils/renderSystem"

export const [addUpdateDTSystem, deleteUpdateDTSystem] = renderSystem(
    (target: { update: (dt: number) => void }) => target.update(dtPtr[0])
)
