import { onAfterRender } from "../events/onAfterRender"
import renderSystem from "./utils/renderSystem"

export const [addClearNumberPtrSystem] = renderSystem(
    (numberPtr: Array<number>) => (numberPtr[0] = 0),
    onAfterRender
)
