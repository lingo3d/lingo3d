import { onAfterRender } from "../../events/onAfterRender"
import configSimpleSystem from "../utils/configSimpleSystem"

export const [addClearCollectionAfterRenderSystem] = configSimpleSystem(
    (collection: Map<any, any> | Set<any>) => collection.clear(),
    onAfterRender
)
