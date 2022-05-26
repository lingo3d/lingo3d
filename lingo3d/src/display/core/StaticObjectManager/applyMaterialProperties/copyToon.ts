import copyMaterial from "./copyMaterial"

const properties = [
    "map",
    "gradientMap",
    "lightMap",
    "lightMapIntensity",
    "aoMap",
    "aoMapIntensity",
    "emissiveMap",
    "emissiveIntensity",
    "bumpMap",
    "bumpScale",
    "normalMap",
    "normalMapType",
    "displacementMap",
    "displacementScale",
    "displacementBias",
    "alphaMap",
    "wireframe",
    "wireframeLinewidth",
    "wireframeLinecap",
    "wireframeLinejoin",
    "fog"
]

export default (source: any, target: any) => {
    copyMaterial(source, target)

    for (const prop of properties) {
        const value = source[prop]
        value != null && (target[prop] = value)
    }

    source.color && target.color.copy(source.color)
    source.emissive && target.emissive.copy(source.emissive)
    source.normalScale && target.normalScale.copy(source.normalScale)
}

