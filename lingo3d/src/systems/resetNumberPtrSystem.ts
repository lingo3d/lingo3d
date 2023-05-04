import { onAfterRender } from "../events/onAfterRender"
import renderSystem from "./utils/renderSystem"

export const [resetClearNumberPtrSystem] = renderSystem(
    (numberPtr: Array<number>) => (numberPtr[0] = 0),
    onAfterRender
)
