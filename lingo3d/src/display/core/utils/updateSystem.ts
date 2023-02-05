import { dtPtr } from "../../../engine/eventLoop"
import beforeRenderSystem from "../../../utils/beforeRenderSystem"

export const [addUpdateSystem, deleteUpdateSystem] = beforeRenderSystem(
    (helper: { update: (dt: number) => void }) => {
        helper.update(dtPtr[0])
    }
)
