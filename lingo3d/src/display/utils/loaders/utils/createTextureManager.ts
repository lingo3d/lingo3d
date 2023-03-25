import { rad2Deg } from "@lincode/math"
import { MeshStandardMaterial } from "three"
import { equalsDefaultValue } from "../../../../interface/utils/getDefaultValue"
import throttleSystem from "../../../../utils/throttleSystem"
import {
    StandardMesh,
    StandardParams
} from "../../../core/mixins/TexturedStandardMixin"
import createMap from "../../../core/mixins/utils/createMap"
import TextureManager from "../../../core/TextureManager"
import createInstancePool from "../../../core/utils/createInstancePool"
import Model from "../../../Model"
import { blackColor } from "../../reusables"

export default (standardMaterial: MeshStandardMaterial) => {
    const defaults = {
        color: "#" + (standardMaterial.color?.getHexString() ?? "ffffff"),
        opacity: standardMaterial.opacity,
        texture: "",
        alphaMap: "",
        textureRepeat: standardMaterial.map?.repeat ?? { x: 1, y: 1 },
        textureFlipY: standardMaterial.map?.flipY ?? false,
        textureRotation: (standardMaterial.map?.rotation ?? 0) * rad2Deg,
        wireframe: standardMaterial.wireframe,
        envMap: "",
        envMapIntensity: standardMaterial.envMapIntensity,
        aoMap: "",
        aoMapIntensity: standardMaterial.aoMapIntensity,
        bumpMap: "",
        bumpScale: standardMaterial.bumpScale,
        displacementMap: "",
        displacementScale: standardMaterial.displacementScale,
        displacementBias: standardMaterial.displacementBias,
        emissive: standardMaterial.emissive
            ? !standardMaterial.emissive.equals(blackColor)
            : false,
        emissiveIntensity: standardMaterial.emissiveIntensity,
        lightMap: "",
        lightMapIntensity: standardMaterial.lightMapIntensity,
        metalnessMap: "",
        metalness: standardMaterial.metalness,
        roughnessMap: "",
        roughness: standardMaterial.roughness,
        normalMap: "",
        normalScale: standardMaterial.normalScale?.x ?? 1,
        depthTest: standardMaterial.depthTest
    }
    const defaultParams = Object.values(defaults) as StandardParams

    const setMaterial = (material: any, key: string, value: any) => {
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

    const [increaseCount, decreaseCount, allocateDefaultInstance] =
        createInstancePool<MeshStandardMaterial, StandardParams>(
            (_, params) => {
                const material = standardMaterial.clone()
                material.userData.TextureManager = MyTextureManager

                setMaterial(material, "color", params[0])
                setMaterial(material, "opacity", params[1])
                setMaterial(
                    material,
                    "transparent",
                    standardMaterial.transparent ||
                        (params[1] !== undefined && params[1] < 1)
                )
                setMaterial(
                    material,
                    "map",
                    createMap(params[2], params[4], params[5], params[6])
                )
                setMaterial(
                    material,
                    "alphaMap",
                    createMap(params[3], params[4], params[5], params[6])
                )
                setMaterial(material, "wireframe", params[7])
                setMaterial(
                    material,
                    "envMap",
                    createMap(params[8], params[4], params[5], params[6])
                )
                setMaterial(material, "envMapIntensity", params[9])
                setMaterial(
                    material,
                    "aoMap",
                    createMap(params[10], params[4], params[5], params[6])
                )
                setMaterial(material, "aoMapIntensity", params[11])
                setMaterial(
                    material,
                    "bumpMap",
                    createMap(params[12], params[4], params[5], params[6])
                )
                setMaterial(material, "bumpScale", params[13])
                setMaterial(
                    material,
                    "displacementMap",
                    createMap(params[14], params[4], params[5], params[6])
                )
                setMaterial(material, "displacementScale", params[15])
                setMaterial(material, "displacementBias", params[16])
                setMaterial(
                    material,
                    "emissive",
                    params[17] ? params[0] : undefined
                )
                setMaterial(material, "emissiveIntensity", params[18])
                setMaterial(
                    material,
                    "lightMap",
                    createMap(params[19], params[4], params[5], params[6])
                )
                setMaterial(material, "lightMapIntensity", params[20])
                setMaterial(
                    material,
                    "metalnessMap",
                    createMap(params[21], params[4], params[5], params[6])
                )
                setMaterial(material, "metalness", params[22])
                setMaterial(
                    material,
                    "roughnessMap",
                    createMap(params[23], params[4], params[5], params[6])
                )
                setMaterial(material, "roughness", params[24])
                setMaterial(
                    material,
                    "normalMap",
                    createMap(params[25], params[4], params[5], params[6])
                )
                setMaterial(material, "normalScale", params[26])
                setMaterial(material, "depthTest", params[27])

                return material
            },
            (material) => material.dispose()
        )

    allocateDefaultInstance(
        MeshStandardMaterial,
        defaultParams,
        standardMaterial
    )

    const refreshParamsSystem = throttleSystem((target: MyTextureManager) => {
        if (target.materialParamString)
            decreaseCount(MeshStandardMaterial, target.materialParamString)
        else
            target.owner.then(() =>
                decreaseCount(MeshStandardMaterial, target.materialParamString!)
            )
        const paramString = JSON.stringify(target.materialParams)
        target.material = increaseCount(
            MeshStandardMaterial,
            target.materialParams,
            paramString
        )
        target.materialParamString = paramString
    })

    class MyTextureManager extends TextureManager {
        public constructor(public object3d: StandardMesh, public owner: Model) {
            super()
        }

        public override defaults = defaults
        public override defaultParams = defaultParams
        public override refreshParamsSystem = refreshParamsSystem

        public static defaults = defaults
        public static defaultParams = defaultParams
        public static refreshParamSystem = refreshParamsSystem
    }

    return MyTextureManager
}
