import { onAfterRender } from "../../events/onAfterRender"
import configSimpleSystem from "../utils/configSimpleSystem"

export const [addClearBooleanPtrAfterRenderSystem] = configSimpleSystem(
    (ptr: [boolean] | Array<boolean>) => (ptr[0] = false),
    onAfterRender
)
