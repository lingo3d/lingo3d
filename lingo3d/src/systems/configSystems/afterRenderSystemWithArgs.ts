import { onAfterRender } from "../../events/onAfterRender"
import callbackSystemWithArgs from "../utils/callbackSystemWithArgs"

export const [addAfterRenderSystemWithArgs] =
    callbackSystemWithArgs(onAfterRender)
