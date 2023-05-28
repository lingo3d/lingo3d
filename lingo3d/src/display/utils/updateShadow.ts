import { LightShadow } from "three"
import { shadowResolutionPtr } from "../../pointers/shadowResolutionPtr"
import { clearNumberPtrSystem } from "../../systems/clearNumberPtrSystem"

clearNumberPtrSystem.add(shadowResolutionPtr)

export default (shadow: LightShadow) => {
    if (shadow.needsUpdate || !shadow.map) return
    shadow.needsUpdate = true
    shadowResolutionPtr[0] += Math.max(shadow.map.width, shadow.map.height)
}
