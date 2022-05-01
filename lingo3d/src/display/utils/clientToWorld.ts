import { containerBounds } from "../../engine/renderLoop/renderSetup"

export default (clientX: number, clientY: number) => {
    const rect = containerBounds[0]
    const x = clientX - (rect.width * 0.5)
    const y = -(clientY - (rect.height * 0.5))
    return [x, y]
}