import { containerBounds } from "../../engine/render/renderSetup"
import { getContainerZoom } from "../../states/useContainerZoom"

export default (clientX: number, clientY: number) => {
    const rect = containerBounds[0]
    const containerZoom = getContainerZoom()
    const x = (clientX - (rect.width * 0.5)) / containerZoom
    const y = -(clientY - (rect.height * 0.5)) / containerZoom
    return [x, y]
}