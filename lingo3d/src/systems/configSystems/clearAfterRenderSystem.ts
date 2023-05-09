import { onAfterRender } from "../../events/onAfterRender"
import configSystem from "../utils/configSystem"

export const [addClearAfterRenderSystem] = configSystem(
    (collection: Map<any, any> | Set<any>) => collection.clear(),
    onAfterRender
)
