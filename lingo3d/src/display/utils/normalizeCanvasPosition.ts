import { containerBounds } from "../../engine/renderLoop/renderSetup"

export default (canvasX: number, canvasY: number) => {
    const rect = containerBounds[0]
    return [
        (canvasX / rect.width) * 2 - 1,
        -(canvasY / rect.height) * 2 + 1,
        canvasX,
        canvasY
    ]
}
