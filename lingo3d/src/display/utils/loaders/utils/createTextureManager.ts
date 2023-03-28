import { rad2Deg } from "@lincode/math"
import { MeshStandardMaterial } from "three"
import { equalsDefaultValue } from "../../../../interface/utils/getDefaultValue"
import { TexturedStandardParams } from "../../../../pools/texturedStandardPool"
import renderSystemAutoClear from "../../../../utils/renderSystemAutoClear"
import { StandardMesh } from "../../../core/mixins/TexturedStandardMixin"
import createMap from "../../../core/mixins/utils/createMap"
import TextureManager from "../../../core/TextureManager"
import createInstancePool from "../../../core/utils/createInstancePool"
import Model from "../../../Model"
import { blackColor } from "../../reusables"

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

const makeDefaults = (referenceMaterial: MeshStandardMaterial) => {
    const defaults = {
        color: "#" + (referenceMaterial.color?.getHexString() ?? "ffffff"),
        opacity: referenceMaterial.opacity,
        texture: "",
        alphaMap: "",
        textureRepeat: referenceMaterial.map?.repeat ?? { x: 1, y: 1 },
        textureFlipY: referenceMaterial.map?.flipY ?? false,
        textureRotation: (referenceMaterial.map?.rotation ?? 0) * rad2Deg,
        wireframe: referenceMaterial.wireframe,
        envMap: "",
        envMapIntensity: referenceMaterial.envMapIntensity,
        aoMap: "",
        aoMapIntensity: referenceMaterial.aoMapIntensity,
        bumpMap: "",
        bumpScale: referenceMaterial.bumpScale,
        displacementMap: "",
        displacementScale: referenceMaterial.displacementScale,
        displacementBias: referenceMaterial.displacementBias,
        emissive: referenceMaterial.emissive
            ? !referenceMaterial.emissive.equals(blackColor)
            : false,
        emissiveIntensity: referenceMaterial.emissiveIntensity,
        lightMap: "",
        lightMapIntensity: referenceMaterial.lightMapIntensity,
        metalnessMap: "",
        metalness: referenceMaterial.metalness,
        roughnessMap: "",
        roughness: referenceMaterial.roughness,
        normalMap: "",
        normalScale: referenceMaterial.normalScale?.x ?? 1,
        depthTest: referenceMaterial.depthTest
    }
    const defaultParams = Object.values(defaults) as TexturedStandardParams

    return <const>[defaults, defaultParams]
}

export default (referenceMaterial: MeshStandardMaterial) => {
    const [defaults, defaultParams] = makeDefaults(referenceMaterial)

    const [increaseCount, decreaseCount, allocateDefaultInstance] =
        createInstancePool<MeshStandardMaterial, TexturedStandardParams>(
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

    allocateDefaultInstance(defaultParams, referenceMaterial)

    const [addRefreshParamsSystem] = renderSystemAutoClear(
        (target: MyTextureManager) => {
            if (target.materialParamString)
                decreaseCount(target.materialParamString)
            else
                target.owner.then(() =>
                    decreaseCount(target.materialParamString!)
                )
            const paramString = JSON.stringify(target.materialParams)
            target.material = increaseCount(target.materialParams, paramString)
            target.materialParamString = paramString
        }
    )

    class MyTextureManager extends TextureManager {
        public constructor(public object3d: StandardMesh, public owner: Model) {
            super()
        }

        public override defaults = defaults
        public override defaultParams = defaultParams
        public override addRefreshParamsSystem = addRefreshParamsSystem

        public static override defaults = defaults
        public static override defaultParams = defaultParams
        public static override addRefreshParamsSystem = addRefreshParamsSystem
    }

    return MyTextureManager
}
