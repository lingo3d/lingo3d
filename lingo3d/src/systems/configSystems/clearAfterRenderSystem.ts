import { onAfterRender } from "../../events/onAfterRender"
import configSimpleSystem from "../utils/configSimpleSystem"

export const [addClearAfterRenderSystem] = configSimpleSystem(
    (collection: Map<any, any> | Set<any>) => collection.clear(),
    onAfterRender
)
