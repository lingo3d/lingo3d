import { Point } from "@lincode/math"
import { MeshStandardMaterial } from "three"
import ITexturedStandard, {
    ColorString
} from "../../interface/ITexturedStandard"
import { MaterialParams } from "../../pools/materialPool"
import { color } from "../utils/reusables"
import {
    StandardMesh,
    standardDefaultParams,
    standardDefaults
} from "./mixins/TexturedStandardMixin"
import Model from "../Model"

export default class TextureManager implements ITexturedStandard {
    public defaults = standardDefaults
    public defaultParams = standardDefaultParams
    public addRefreshParamsSystem(_: TextureManager) {}

    public static defaults = standardDefaults
    public static defaultParams = standardDefaultParams
    public static addRefreshParamsSystem(_: TextureManager) {}

    public constructor(public object3d: StandardMesh, public owner: Model) {}

    public get material() {
        return this.object3d.material
    }
    public set material(val: MeshStandardMaterial) {
        this.object3d.material = val
    }

    public _materialParams?: MaterialParams
    public get materialParams() {
        return (this._materialParams ??= Object.values(
            this.defaultParams
        ) as MaterialParams)
    }

    public materialParamString?: string

    public get color() {
        return this.materialParams[0]
    }
    public set color(val: ColorString | undefined) {
        this.materialParams[0] = val
            ? "#" + color.set(val).getHexString()
            : this.defaults.color
        this.addRefreshParamsSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val: number | undefined) {
        this.materialParams[1] = val ?? this.defaults.opacity
        this.addRefreshParamsSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val: string | undefined) {
        this.materialParams[2] = val ?? this.defaults.texture
        this.addRefreshParamsSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val: string | undefined) {
        this.materialParams[3] = val ?? this.defaults.alphaMap
        this.addRefreshParamsSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4]
    }
    public set textureRepeat(val: number | Point | undefined) {
        this.materialParams[4] = val ?? this.defaults.textureRepeat
        this.addRefreshParamsSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5]
    }
    public set textureFlipY(val: boolean | undefined) {
        this.materialParams[5] = val ?? this.defaults.textureFlipY
        this.addRefreshParamsSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6]
    }
    public set textureRotation(val: number | undefined) {
        this.materialParams[6] = val ?? this.defaults.textureRotation
        this.addRefreshParamsSystem(this)
    }

    public get wireframe() {
        return this.materialParams[7]
    }
    public set wireframe(val: boolean | undefined) {
        this.materialParams[7] = val ?? this.defaults.wireframe
        this.addRefreshParamsSystem(this)
    }

    public get envMap() {
        return this.materialParams[8]
    }
    public set envMap(val: string | undefined) {
        this.materialParams[8] = val ?? this.defaults.envMap
        this.addRefreshParamsSystem(this)
    }

    public get envMapIntensity() {
        return this.materialParams[9]
    }
    public set envMapIntensity(val: number | undefined) {
        this.materialParams[9] = val ?? this.defaults.envMapIntensity
        this.addRefreshParamsSystem(this)
    }

    public get aoMap() {
        return this.materialParams[10]
    }
    public set aoMap(val: string | undefined) {
        this.materialParams[10] = val ?? this.defaults.aoMap
        this.addRefreshParamsSystem(this)
    }

    public get aoMapIntensity() {
        return this.materialParams[11]
    }
    public set aoMapIntensity(val: number | undefined) {
        this.materialParams[11] = val ?? this.defaults.aoMapIntensity
        this.addRefreshParamsSystem(this)
    }

    public get bumpMap() {
        return this.materialParams[12]
    }
    public set bumpMap(val: string | undefined) {
        this.materialParams[12] = val ?? this.defaults.bumpMap
        this.addRefreshParamsSystem(this)
    }

    public get bumpScale() {
        return this.materialParams[13]
    }
    public set bumpScale(val: number | undefined) {
        this.materialParams[13] = val ?? this.defaults.bumpScale
        this.addRefreshParamsSystem(this)
    }

    public get displacementMap() {
        return this.materialParams[14]
    }
    public set displacementMap(val: string | undefined) {
        this.materialParams[14] = val ?? this.defaults.displacementMap
        this.addRefreshParamsSystem(this)
    }

    public get displacementScale() {
        return this.materialParams[15]
    }
    public set displacementScale(val: number | undefined) {
        this.materialParams[15] = val ?? this.defaults.displacementScale
        this.addRefreshParamsSystem(this)
    }

    public get displacementBias() {
        return this.materialParams[16]
    }
    public set displacementBias(val: number | undefined) {
        this.materialParams[16] = val ?? this.defaults.displacementBias
        this.addRefreshParamsSystem(this)
    }

    public get emissive() {
        return this.materialParams[17]
    }
    public set emissive(val: boolean | undefined) {
        this.materialParams[17] = val ?? this.defaults.emissive
        this.addRefreshParamsSystem(this)
    }

    public get emissiveIntensity() {
        return this.materialParams[18]
    }
    public set emissiveIntensity(val: number | undefined) {
        this.materialParams[18] = val ?? this.defaults.emissiveIntensity
        this.addRefreshParamsSystem(this)
    }

    public get lightMap() {
        return this.materialParams[19]
    }
    public set lightMap(val: string | undefined) {
        this.materialParams[19] = val ?? this.defaults.lightMap
        this.addRefreshParamsSystem(this)
    }

    public get lightMapIntensity() {
        return this.materialParams[20]
    }
    public set lightMapIntensity(val: number | undefined) {
        this.materialParams[20] = val ?? this.defaults.lightMapIntensity
        this.addRefreshParamsSystem(this)
    }

    public get metalnessMap() {
        return this.materialParams[21]
    }
    public set metalnessMap(val: string | undefined) {
        this.materialParams[21] = val ?? this.defaults.metalnessMap
        this.addRefreshParamsSystem(this)
    }

    public get metalness() {
        return this.materialParams[22]
    }
    public set metalness(val: number | undefined) {
        this.materialParams[22] = val ?? this.defaults.metalness
        this.addRefreshParamsSystem(this)
    }

    public get roughnessMap() {
        return this.materialParams[23]
    }
    public set roughnessMap(val: string | undefined) {
        this.materialParams[23] = val ?? this.defaults.roughnessMap
        this.addRefreshParamsSystem(this)
    }

    public get roughness() {
        return this.materialParams[24]
    }
    public set roughness(val: number | undefined) {
        this.materialParams[24] = val ?? this.defaults.roughness
        this.addRefreshParamsSystem(this)
    }

    public get normalMap() {
        return this.materialParams[25]
    }
    public set normalMap(val: string | undefined) {
        this.materialParams[25] = val ?? this.defaults.normalMap
        this.addRefreshParamsSystem(this)
    }

    public get normalScale() {
        return this.materialParams[26]
    }
    public set normalScale(val: number | undefined) {
        this.materialParams[26] = val ?? this.defaults.normalScale
        this.addRefreshParamsSystem(this)
    }

    public get depthTest() {
        return this.materialParams[27]
    }
    public set depthTest(val: boolean | undefined) {
        this.materialParams[27] = val ?? this.defaults.depthTest
        this.addRefreshParamsSystem(this)
    }
}
