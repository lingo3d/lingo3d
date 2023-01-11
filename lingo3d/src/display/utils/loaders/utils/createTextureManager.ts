import { Point, rad2Deg } from "@lincode/math"
import { BufferGeometry, Color, Mesh, MeshStandardMaterial } from "three"
import Appendable from "../../../../api/core/Appendable"
import ITextureManager from "../../../../interface/ITextureManager"
import { equalsDefaultValue } from "../../../../interface/utils/getDefaultValue"
import debounceSystem from "../../../../utils/debounceSystem"
import { TexturedStandardParams } from "../../../core/mixins/TexturedStandardMixin"
import getMap from "../../../core/mixins/utils/getMap"
import createReferenceCounter from "../../../core/utils/createReferenceCounter"
import Model from "../../../Model"
import { color } from "../../reusables"

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
            },
            MeshStandardMaterial
        )

    allocateDefaultInstance(MeshStandardMaterial, defaultParams)

    const refreshParamsSystem = debounceSystem((target: TextureManager) => {
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

    class TextureManager implements ITextureManager {
        public constructor(
            public object3d: Mesh<BufferGeometry, MeshStandardMaterial>,
            public owner: Model
        ) {}

        public defaults = defaults

        public get material() {
            return this.object3d.material
        }
        public set material(val) {
            this.object3d.material = val
        }

        public get materialParams(): TexturedStandardParams {
            //@ts-ignore
            return (this._materialParams ??= Object.values(defaultParams))
        }
        public materialParamString?: string

        public get color() {
            return this.materialParams[0]
        }
        public set color(val: string | undefined) {
            this.materialParams[0] = val
                ? "#" + color.set(val).getHexString()
                : defaults.color
            refreshParamsSystem(this)
        }

        public get opacity() {
            return this.materialParams[1]
        }
        public set opacity(val: number | undefined) {
            this.materialParams[1] = val ?? defaults.opacity
            refreshParamsSystem(this)
        }

        public get texture() {
            return this.materialParams[2]
        }
        public set texture(val: string | undefined) {
            this.materialParams[2] = val ?? defaults.texture
            refreshParamsSystem(this)
        }

        public get alphaMap() {
            return this.materialParams[3]
        }
        public set alphaMap(val: string | undefined) {
            this.materialParams[3] = val ?? defaults.alphaMap
            refreshParamsSystem(this)
        }

        public get textureRepeat() {
            return this.materialParams[4]
        }
        public set textureRepeat(val: number | Point | undefined) {
            this.materialParams[4] = val ?? defaults.textureRepeat
            refreshParamsSystem(this)
        }

        public get textureFlipY() {
            return this.materialParams[5]
        }
        public set textureFlipY(val: boolean | undefined) {
            this.materialParams[5] = val ?? defaults.textureFlipY
            refreshParamsSystem(this)
        }

        public get textureRotation() {
            return this.materialParams[6]
        }
        public set textureRotation(val: number | undefined) {
            this.materialParams[6] = val ?? defaults.textureRotation
            refreshParamsSystem(this)
        }

        public get wireframe() {
            return this.materialParams[7]
        }
        public set wireframe(val: boolean | undefined) {
            this.materialParams[7] = val ?? defaults.wireframe
            refreshParamsSystem(this)
        }

        public get envMap() {
            return this.materialParams[8]
        }
        public set envMap(val: string | undefined) {
            this.materialParams[8] = val ?? defaults.envMap
            refreshParamsSystem(this)
        }

        public get envMapIntensity() {
            return this.materialParams[9]
        }
        public set envMapIntensity(val: number | undefined) {
            this.materialParams[9] = val ?? defaults.envMapIntensity
            refreshParamsSystem(this)
        }

        public get aoMap() {
            return this.materialParams[10]
        }
        public set aoMap(val: string | undefined) {
            this.materialParams[10] = val ?? defaults.aoMap
            refreshParamsSystem(this)
        }

        public get aoMapIntensity() {
            return this.materialParams[11]
        }
        public set aoMapIntensity(val: number | undefined) {
            this.materialParams[11] = val ?? defaults.aoMapIntensity
            refreshParamsSystem(this)
        }

        public get bumpMap() {
            return this.materialParams[12]
        }
        public set bumpMap(val: string | undefined) {
            this.materialParams[12] = val ?? defaults.bumpMap
            refreshParamsSystem(this)
        }

        public get bumpScale() {
            return this.materialParams[13]
        }
        public set bumpScale(val: number | undefined) {
            this.materialParams[13] = val ?? defaults.bumpScale
            refreshParamsSystem(this)
        }

        public get displacementMap() {
            return this.materialParams[14]
        }
        public set displacementMap(val: string | undefined) {
            this.materialParams[14] = val ?? defaults.displacementMap
            refreshParamsSystem(this)
        }

        public get displacementScale() {
            return this.materialParams[15]
        }
        public set displacementScale(val: number | undefined) {
            this.materialParams[15] = val ?? defaults.displacementScale
            refreshParamsSystem(this)
        }

        public get displacementBias() {
            return this.materialParams[16]
        }
        public set displacementBias(val: number | undefined) {
            this.materialParams[16] = val ?? defaults.displacementBias
            refreshParamsSystem(this)
        }

        public get emissive() {
            return this.materialParams[17]
        }
        public set emissive(val: boolean | undefined) {
            this.materialParams[17] = val ?? defaults.emissive
            refreshParamsSystem(this)
        }

        public get emissiveIntensity() {
            return this.materialParams[18]
        }
        public set emissiveIntensity(val: number | undefined) {
            this.materialParams[18] = val ?? defaults.emissiveIntensity
            refreshParamsSystem(this)
        }

        public get lightMap() {
            return this.materialParams[19]
        }
        public set lightMap(val: string | undefined) {
            this.materialParams[19] = val ?? defaults.lightMap
            refreshParamsSystem(this)
        }

        public get lightMapIntensity() {
            return this.materialParams[20]
        }
        public set lightMapIntensity(val: number | undefined) {
            this.materialParams[20] = val ?? defaults.lightMapIntensity
            refreshParamsSystem(this)
        }

        public get metalnessMap() {
            return this.materialParams[21]
        }
        public set metalnessMap(val: string | undefined) {
            this.materialParams[21] = val ?? defaults.metalnessMap
            refreshParamsSystem(this)
        }

        public get metalness() {
            return this.materialParams[22]
        }
        public set metalness(val: number | undefined) {
            this.materialParams[22] = val ?? defaults.metalness
            refreshParamsSystem(this)
        }

        public get roughnessMap() {
            return this.materialParams[23]
        }
        public set roughnessMap(val: string | undefined) {
            this.materialParams[23] = val ?? defaults.roughnessMap
            refreshParamsSystem(this)
        }

        public get roughness() {
            return this.materialParams[24]
        }
        public set roughness(val: number | undefined) {
            this.materialParams[24] = val ?? defaults.roughness
            refreshParamsSystem(this)
        }

        public get normalMap() {
            return this.materialParams[25]
        }
        public set normalMap(val: string | undefined) {
            this.materialParams[25] = val ?? defaults.normalMap
            refreshParamsSystem(this)
        }

        public get normalScale() {
            return this.materialParams[26]
        }
        public set normalScale(val: number | undefined) {
            this.materialParams[26] = val ?? defaults.normalScale
            refreshParamsSystem(this)
        }
    }

    return TextureManager
}
