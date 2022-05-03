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

export default (source: any, target: any) => {
    for (const prop of properties) {
        const value = source[prop]
        value != null && (target[prop] = value)
    }

    const srcPlanes = source.clippingPlanes
    let dstPlanes = null

    if (srcPlanes) {
        const n = srcPlanes.length
        dstPlanes = new Array(n)

        for (let i = 0; i !== n; ++i)
            dstPlanes[i] = srcPlanes[i].clone()
    }
    target.clippingPlanes = dstPlanes
}