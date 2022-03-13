import { containerBounds } from "../../engine/render/renderer"
import { getContainerZoom } from "../../states/useContainerZoom"

export default (clientX: number, clientY: number) => {
    const rect = containerBounds[0]
    const x = (clientX - (rect.width * 0.5)) / getContainerZoom()
    const y = -(clientY - (rect.height * 0.5)) / getContainerZoom()
    return [x, y]
}