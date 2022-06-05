import { Material } from "three"

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

export const ogMaterialMap = new WeakMap<Material, Material>()

export default (from: any, to: any) => {
    const og = ogMaterialMap.get(from) ?? from
    ogMaterialMap.set(to, og)

    for (const prop of properties) {
        const value = from[prop]
        value != null && (to[prop] = value)
    }

    const srcPlanes = from.clippingPlanes
    let dstPlanes = null

    if (srcPlanes) {
        const n = srcPlanes.length
        dstPlanes = new Array(n)

        for (let i = 0; i !== n; ++i)
            dstPlanes[i] = srcPlanes[i].clone()
    }
    to.clippingPlanes = dstPlanes
}