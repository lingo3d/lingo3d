import copyMaterial from "./copyMaterial"

export const properties = [
    "roughness",
    "metalness",
    "map",
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
    "roughnessMap",
    "metalnessMap",
    "alphaMap",
    "envMap",
    "envMapIntensity",
    "wireframe",
    "wireframeLinewidth",
    "wireframeLinecap",
    "wireframeLinejoin",
    "flatShading",
    "fog"
]

export default (source: any, target: any) => {
    copyMaterial(source, target)

    for (const prop of properties) {
        const value = source[prop]
        value != null && (target[prop] = value)
    }

    target.defines = {"STANDARD": ""}
    source.color && target.color.copy(source.color)
    source.emissive && target.emissive.copy(source.emissive)
    source.normalScale && target.normalScale.copy(source.normalScale)
}