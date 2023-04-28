import { LightShadow } from "three"
import { onAfterRender } from "../../events/onAfterRender"

let resolution = 0
onAfterRender(() => (resolution = 0))

export default (shadow: LightShadow) => {
    if (shadow.needsUpdate || !shadow.map) return resolution
    shadow.needsUpdate = true
    resolution += Math.max(shadow.map.width, shadow.map.height)
    return resolution
}
