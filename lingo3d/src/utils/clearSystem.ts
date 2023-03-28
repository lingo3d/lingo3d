import { onAfterRender } from "../events/onAfterRender"
import renderSystemAutoClear from "./renderSystemAutoClear"

export const [addClearSystem] = renderSystemAutoClear(
    (collection: Map<any, any> | Set<any>) => collection.clear(),
    onAfterRender
)