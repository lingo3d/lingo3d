import { LightShadow } from "three"
import { onAfterRender } from "../../events/onAfterRender"
import { shadowResolutionPtr } from "../../pointers/shadowResolutionPtr"

onAfterRender(() => (shadowResolutionPtr[0] = 0))

export default (shadow: LightShadow) => {
    if (shadow.needsUpdate || !shadow.map) return
    shadow.needsUpdate = true
    shadowResolutionPtr[0] += Math.max(shadow.map.width, shadow.map.height)
}
