import { Class } from "@lincode/utils"
import { MeshStandardMaterial } from "three"
import createMap from "../display/core/mixins/utils/createMap"
import TextureManager from "../display/core/TextureManager"
import createInstancePool from "../display/core/utils/createInstancePool"
import { equalsDefaultValue } from "../interface/utils/getDefaultValue"
import { MaterialParams } from "./materialPool"

const setMaterial = (
    material: any,
    key: string,
    value: any,
    defaults: Record<string, any>
) => {
    if (value == undefined) return
    if (equalsDefaultValue(value, defaults, key)) return

    const current = material[key]
    if (current == value) return

    if (current && typeof current === "object" && "set" in current) {
        if ("x" in current) {
            current.set(value.x ?? value, value.y ?? value)
            return
        }
        current.set(value)
        return
    }
    material[key] = value
}

export const createReferenceMaterialPool = (
    referenceMaterial: MeshStandardMaterial,
    defaults: Record<string, any>,
    MyTextureManager: Class<TextureManager>
) => {
    return createInstancePool<MeshStandardMaterial, MaterialParams>(
        (params) => {
            const material = referenceMaterial.clone()
            material.userData.TextureManager = MyTextureManager

            setMaterial(material, "color", params[0], defaults)
            setMaterial(material, "opacity", params[1], defaults)
            setMaterial(
                material,
                "transparent",
                referenceMaterial.transparent ||
                    (params[1] !== undefined && params[1] < 1),
                defaults
            )
            setMaterial(
                material,
                "map",
                createMap(params[2], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(
                material,
                "alphaMap",
                createMap(params[3], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "wireframe", params[7], defaults)
            setMaterial(
                material,
                "envMap",
                createMap(params[8], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "envMapIntensity", params[9], defaults)
            setMaterial(
                material,
                "aoMap",
                createMap(params[10], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "aoMapIntensity", params[11], defaults)
            setMaterial(
                material,
                "bumpMap",
                createMap(params[12], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "bumpScale", params[13], defaults)
            setMaterial(
                material,
                "displacementMap",
                createMap(params[14], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "displacementScale", params[15], defaults)
            setMaterial(material, "displacementBias", params[16], defaults)
            setMaterial(
                material,
                "emissive",
                params[17] ? params[0] : undefined,
                defaults
            )
            setMaterial(material, "emissiveIntensity", params[18], defaults)
            setMaterial(
                material,
                "lightMap",
                createMap(params[19], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "lightMapIntensity", params[20], defaults)
            setMaterial(
                material,
                "metalnessMap",
                createMap(params[21], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "metalness", params[22], defaults)
            setMaterial(
                material,
                "roughnessMap",
                createMap(params[23], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "roughness", params[24], defaults)
            setMaterial(
                material,
                "normalMap",
                createMap(params[25], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "normalScale", params[26], defaults)
            setMaterial(material, "depthTest", params[27], defaults)

            return material
        },
        (material) => material.dispose()
    )
}
