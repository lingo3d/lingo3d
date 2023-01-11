import { rad2Deg } from "@lincode/math"
import { BufferGeometry, Color, Mesh, MeshStandardMaterial } from "three"
import { equalsDefaultValue } from "../../../../interface/utils/getDefaultValue"
import debounceSystem from "../../../../utils/debounceSystem"
import { TexturedStandardParams } from "../../../core/mixins/TexturedStandardMixin"
import getMap from "../../../core/mixins/utils/getMap"
import TextureManager from "../../../core/TextureManager"
import createReferenceCounter from "../../../core/utils/createReferenceCounter"
import Model from "../../../Model"

const blackColor = new Color("black")

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
        normalScale: standardMaterial.normalScale?.x ?? 1
    }
    const defaultParams = Object.values(defaults) as TexturedStandardParams

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
        createReferenceCounter<MeshStandardMaterial, TexturedStandardParams>(
            (_, params) => {
                const material = standardMaterial.clone()
                setMaterial(material, "color", params[0])
                setMaterial(material, "opacity", params[1])
                setMaterial(
                    material,
                    "transparent",
                    params[1] !== undefined && params[1] < 1
                )
                setMaterial(
                    material,
                    "map",
                    getMap(params[2], params[4], params[5], params[6])
                )
                setMaterial(
                    material,
                    "alphaMap",
                    getMap(params[3], params[4], params[5], params[6])
                )
                setMaterial(material, "wireframe", params[7])
                setMaterial(
                    material,
                    "envMap",
                    getMap(params[8], params[4], params[5], params[6])
                )
                setMaterial(material, "envMapIntensity", params[9])
                setMaterial(
                    material,
                    "aoMap",
                    getMap(params[10], params[4], params[5], params[6])
                )
                setMaterial(material, "aoMapIntensity", params[11])
                setMaterial(
                    material,
                    "bumpMap",
                    getMap(params[12], params[4], params[5], params[6])
                )
                setMaterial(material, "bumpScale", params[13])
                setMaterial(
                    material,
                    "displacementMap",
                    getMap(params[14], params[4], params[5], params[6])
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
                    getMap(params[19], params[4], params[5], params[6])
                )
                setMaterial(material, "lightMapIntensity", params[20])
                setMaterial(
                    material,
                    "metalnessMap",
                    getMap(params[21], params[4], params[5], params[6])
                )
                setMaterial(material, "metalness", params[22])
                setMaterial(
                    material,
                    "roughnessMap",
                    getMap(params[23], params[4], params[5], params[6])
                )
                setMaterial(material, "roughness", params[24])
                setMaterial(
                    material,
                    "normalMap",
                    getMap(params[25], params[4], params[5], params[6])
                )
                setMaterial(material, "normalScale", params[26])

                return material
            }
        )

    allocateDefaultInstance(MeshStandardMaterial, defaultParams)

    const refreshParamsSystem = debounceSystem((target: MyTextureManager) => {
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
        public constructor(
            public object3d: Mesh<BufferGeometry, MeshStandardMaterial>,
            public owner: Model
        ) {
            super()
        }

        public defaults = defaults

        protected defaultParams = defaultParams
        protected refreshParamsSystem = refreshParamsSystem
    }

    return MyTextureManager
}
