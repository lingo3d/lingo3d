import { Material } from "three"
import unsafeGetValue from "../../../../utils/unsafeGetValue"
import unsafeSetValue from "../../../../utils/unsafeSetValue"

const properties = [
    "name",
    "blending",
    "side",
    "vertexColors",
    "opacity",
    "transparent",
    "blendSrc",
    "blendDst",
    "blendEquation",
    "blendSrcAlpha",
    "blendDstAlpha",
    "blendEquationAlpha",
    "depthFunc",
    "depthTest",
    "depthWrite",
    "stencilWriteMask",
    "stencilFunc",
    "stencilRef",
    "stencilFuncMask",
    "stencilFail",
    "stencilZFail",
    "stencilZPass",
    "stencilWrite",
    "clipIntersection",
    "clipShadows",
    "shadowSide",
    "colorWrite",
    "precision",
    "polygonOffset",
    "polygonOffsetFactor",
    "polygonOffsetUnits",
    "dithering",
    "alphaTest",
    "alphaToCoverage",
    "premultipliedAlpha",
    "visible",
    "toneMapped"
]

export default (from: Material, to: Material) => {
    for (const prop of properties) {
        const value = unsafeGetValue(from, prop)
        value != null && unsafeSetValue(to, prop, value)
    }

    const srcPlanes = from.clippingPlanes
    let dstPlanes = null

    if (srcPlanes) {
        const n = srcPlanes.length
        dstPlanes = new Array(n)

        for (let i = 0; i !== n; ++i) dstPlanes[i] = srcPlanes[i].clone()
    }
    to.clippingPlanes = dstPlanes
}
