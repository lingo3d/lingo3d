import { MeshStandardMaterial } from "three"
import unsafeGetValue from "../../../../utils/unsafeGetValue"
import unsafeSetValue from "../../../../utils/unsafeSetValue"
import copyMaterial from "./copyMaterial"

const properties = [
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

export default (source: MeshStandardMaterial, target: MeshStandardMaterial) => {
    copyMaterial(source, target)

    for (const prop of properties) {
        const value = unsafeGetValue(source, prop)
        value != null && unsafeSetValue(target, prop, value)
    }

    target.defines = { STANDARD: "" }
    source.color && target.color.copy(source.color)
    source.emissive && target.emissive.copy(source.emissive)
    source.normalScale && target.normalScale.copy(source.normalScale)
}
