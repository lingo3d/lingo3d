import { filter } from "@lincode/utils"
import { MeshStandardMaterial, DoubleSide, Vector2 } from "three"
import filterNotDefault from "../display/core/mixins/utils/filterNotDefault"
import createSharedPool from "./utils/createSharedPool"
import { Blending, ColorString } from "../interface/ITexturedStandard"
import { uuidMaterialMap } from "../collections/idCollections"
import { equalsDefaultValue } from "../interface/utils/getDefaultValue"
import { materialDefaultsMap } from "../collections/materialDefaultsMap"
import { castBlending } from "../display/utils/castBlending"
import { texturePool } from "./texturePool"
import { csmMaterialSet } from "../collections/csmMaterialSet"
import { skyLightPtr } from "../pointers/skyLightPtr"

export type MaterialParams = [
    color: ColorString,
    opacity: number,
    texture: string,
    alphaMap: string,
    textureRepeat: number,
    textureFlipY: boolean,
    textureRotation: number,
    wireframe: boolean,
    envMap: string,
    envMapIntensity: number,
    aoMap: string,
    aoMapIntensity: number,
    bumpMap: string,
    bumpScale: number,
    displacementMap: string,
    displacementScale: number,
    displacementBias: number,
    emissive: boolean,
    emissiveIntensity: number,
    lightMap: string,
    lightMapIntensity: number,
    metalnessMap: string,
    metalness: number,
    roughnessMap: string,
    roughness: number,
    normalMap: string,
    normalScale: number,
    depthTest: boolean,
    blending: Blending,
    referenceUUID: string
]

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

const createTextureMap = (
    texture: string,
    textureRepeat: number,
    textureFlipY: boolean,
    textureRotation: number
) =>
    texture
        ? texturePool.request([
              texture,
              textureRepeat,
              textureFlipY,
              textureRotation
          ])
        : undefined

export const materialPool = createSharedPool<
    MeshStandardMaterial,
    MaterialParams
>(
    (params) => {
        const referenceUUID = params[29]
        if (referenceUUID) {
            const referenceMaterial = uuidMaterialMap.get(referenceUUID)!
            const defaults = materialDefaultsMap.get(referenceMaterial)!
            const material = referenceMaterial.clone()

            setMaterial(material, "color", params[0], defaults)
            setMaterial(material, "opacity", params[1], defaults)
            setMaterial(
                material,
                "transparent",
                referenceMaterial.transparent ||
                    params[1] < 1 ||
                    params[3].length > 0,
                defaults
            )
            setMaterial(
                material,
                "map",
                createTextureMap(params[2], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(
                material,
                "alphaMap",
                createTextureMap(params[3], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "wireframe", params[7], defaults)
            setMaterial(
                material,
                "envMap",
                createTextureMap(params[8], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "envMapIntensity", params[9], defaults)
            setMaterial(
                material,
                "aoMap",
                createTextureMap(params[10], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "aoMapIntensity", params[11], defaults)
            setMaterial(
                material,
                "bumpMap",
                createTextureMap(params[12], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "bumpScale", params[13], defaults)
            setMaterial(
                material,
                "displacementMap",
                createTextureMap(params[14], params[4], params[5], params[6]),
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
                createTextureMap(params[19], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "lightMapIntensity", params[20], defaults)
            setMaterial(
                material,
                "metalnessMap",
                createTextureMap(params[21], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "metalness", params[22], defaults)
            setMaterial(
                material,
                "roughnessMap",
                createTextureMap(params[23], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "roughness", params[24], defaults)
            setMaterial(
                material,
                "normalMap",
                createTextureMap(params[25], params[4], params[5], params[6]),
                defaults
            )
            setMaterial(material, "normalScale", params[26], defaults)
            setMaterial(material, "depthTest", params[27], defaults)
            setMaterial(material, "blending", params[28], defaults)

            csmMaterialSet.add(material)
            return material
        }
        const material = new MeshStandardMaterial(
            filter(
                {
                    side: DoubleSide,
                    color: params[0],
                    opacity: params[1],
                    transparent: params[1] < 1 || params[3].length > 0,
                    map: createTextureMap(
                        params[2],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    alphaMap: createTextureMap(
                        params[3],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    wireframe: params[7],
                    envMap: createTextureMap(
                        params[8],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    envMapIntensity: params[9],
                    aoMap: createTextureMap(
                        params[10],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    aoMapIntensity: params[11],
                    bumpMap: createTextureMap(
                        params[12],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    bumpScale: params[13],
                    displacementMap: createTextureMap(
                        params[14],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    displacementScale: params[15],
                    displacementBias: params[16],
                    emissive: params[17] ? params[0] : undefined,
                    emissiveIntensity: params[18],
                    lightMap: createTextureMap(
                        params[19],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    lightMapIntensity: params[20],
                    metalnessMap: createTextureMap(
                        params[21],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    metalness: params[22],
                    roughnessMap: createTextureMap(
                        params[23],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    roughness: params[24],
                    normalMap: createTextureMap(
                        params[25],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    normalScale: new Vector2(params[26], params[26]),
                    depthTest: params[27],
                    blending: castBlending(params[28])
                },
                filterNotDefault
            )
        )
        csmMaterialSet.add(material)
        return material
    },
    (material) => {
        texturePool.release(material.map)
        texturePool.release(material.alphaMap)
        texturePool.release(material.envMap)
        texturePool.release(material.aoMap)
        texturePool.release(material.bumpMap)
        texturePool.release(material.displacementMap)
        texturePool.release(material.lightMap)
        texturePool.release(material.metalnessMap)
        texturePool.release(material.roughnessMap)
        texturePool.release(material.normalMap)
        csmMaterialSet.delete(material)
        skyLightPtr[0]?.$csmMaterials.delete(material)
        material.dispose()
    }
)
