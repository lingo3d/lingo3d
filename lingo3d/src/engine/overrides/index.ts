import { Object3D } from "three"
import { shadowModePtr } from "../../pointers/shadowModePtr"
// import lights_pars_begin from "./lights_pars_begin"
// import lights_fragment_begin from "./lights_fragment_begin"

// ShaderChunk.lights_pars_begin = lights_pars_begin
// ShaderChunk.lights_fragment_begin = lights_fragment_begin

const clone = Object3D.prototype.clone
Object3D.prototype.clone = function (recursive) {
    const result = clone.call(this, recursive)
    if (!shadowModePtr[0]) result.castShadow = false
    return result
}
