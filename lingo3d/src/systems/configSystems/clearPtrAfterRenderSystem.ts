import { onAfterRender } from "../../events/onAfterRender"
import configSimpleSystem from "../utils/configSimpleSystem"

export const [addClearPtrAfterRenderSystem] = configSimpleSystem(
    (ptr: [any] | Array<any>) => (ptr[0] = undefined),
    onAfterRender
)
