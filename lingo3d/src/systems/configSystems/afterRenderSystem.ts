import { onAfterRender } from "../../events/onAfterRender"
import callbackSystem from "../utils/callbackSystem"

export const [addAfterRenderSystem] = callbackSystem(onAfterRender)
