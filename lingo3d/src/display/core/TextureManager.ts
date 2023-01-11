import { Point } from "@lincode/math"
import { MeshStandardMaterial } from "three"
import ITextureManager from "../../interface/ITextureManager"
import { color } from "../utils/reusables"
import {
    standardDefaultParams,
    standardDefaults,
    StandardParams
} from "./mixins/TexturedStandardMixin"

export default abstract class TextureManager implements ITextureManager {
    public defaults = standardDefaults
    public defaultParams = standardDefaultParams
    public refreshParamsSystem(_: TextureManager) {}

    public get material() {
        //@ts-ignore
        return this.object3d.material
    }
    public set material(val: MeshStandardMaterial) {
        //@ts-ignore
        this.object3d.material = val
    }

    public get materialParams(): StandardParams {
        //@ts-ignore
        return (this._materialParams ??= Object.values(this.defaultParams))
    }

    public materialParamString?: string

    public get color() {
        return this.materialParams[0]
    }
    public set color(val: string | undefined) {
        this.materialParams[0] = val
            ? "#" + color.set(val).getHexString()
            : this.defaults.color
        this.refreshParamsSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val: number | undefined) {
        this.materialParams[1] = val ?? this.defaults.opacity
        this.refreshParamsSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val: string | undefined) {
        this.materialParams[2] = val ?? this.defaults.texture
        this.refreshParamsSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val: string | undefined) {
        this.materialParams[3] = val ?? this.defaults.alphaMap
        this.refreshParamsSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4]
    }
    public set textureRepeat(val: number | Point | undefined) {
        this.materialParams[4] = val ?? this.defaults.textureRepeat
        this.refreshParamsSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5]
    }
    public set textureFlipY(val: boolean | undefined) {
        this.materialParams[5] = val ?? this.defaults.textureFlipY
        this.refreshParamsSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6]
    }
    public set textureRotation(val: number | undefined) {
        this.materialParams[6] = val ?? this.defaults.textureRotation
        this.refreshParamsSystem(this)
    }

    public get wireframe() {
        return this.materialParams[7]
    }
    public set wireframe(val: boolean | undefined) {
        this.materialParams[7] = val ?? this.defaults.wireframe
        this.refreshParamsSystem(this)
    }

    public get envMap() {
        return this.materialParams[8]
    }
    public set envMap(val: string | undefined) {
        this.materialParams[8] = val ?? this.defaults.envMap
        this.refreshParamsSystem(this)
    }

    public get envMapIntensity() {
        return this.materialParams[9]
    }
    public set envMapIntensity(val: number | undefined) {
        this.materialParams[9] = val ?? this.defaults.envMapIntensity
        this.refreshParamsSystem(this)
    }

    public get aoMap() {
        return this.materialParams[10]
    }
    public set aoMap(val: string | undefined) {
        this.materialParams[10] = val ?? this.defaults.aoMap
        this.refreshParamsSystem(this)
    }

    public get aoMapIntensity() {
        return this.materialParams[11]
    }
    public set aoMapIntensity(val: number | undefined) {
        this.materialParams[11] = val ?? this.defaults.aoMapIntensity
        this.refreshParamsSystem(this)
    }

    public get bumpMap() {
        return this.materialParams[12]
    }
    public set bumpMap(val: string | undefined) {
        this.materialParams[12] = val ?? this.defaults.bumpMap
        this.refreshParamsSystem(this)
    }

    public get bumpScale() {
        return this.materialParams[13]
    }
    public set bumpScale(val: number | undefined) {
        this.materialParams[13] = val ?? this.defaults.bumpScale
        this.refreshParamsSystem(this)
    }

    public get displacementMap() {
        return this.materialParams[14]
    }
    public set displacementMap(val: string | undefined) {
        this.materialParams[14] = val ?? this.defaults.displacementMap
        this.refreshParamsSystem(this)
    }

    public get displacementScale() {
        return this.materialParams[15]
    }
    public set displacementScale(val: number | undefined) {
        this.materialParams[15] = val ?? this.defaults.displacementScale
        this.refreshParamsSystem(this)
    }

    public get displacementBias() {
        return this.materialParams[16]
    }
    public set displacementBias(val: number | undefined) {
        this.materialParams[16] = val ?? this.defaults.displacementBias
        this.refreshParamsSystem(this)
    }

    public get emissive() {
        return this.materialParams[17]
    }
    public set emissive(val: boolean | undefined) {
        this.materialParams[17] = val ?? this.defaults.emissive
        this.refreshParamsSystem(this)
    }

    public get emissiveIntensity() {
        return this.materialParams[18]
    }
    public set emissiveIntensity(val: number | undefined) {
        this.materialParams[18] = val ?? this.defaults.emissiveIntensity
        this.refreshParamsSystem(this)
    }

    public get lightMap() {
        return this.materialParams[19]
    }
    public set lightMap(val: string | undefined) {
        this.materialParams[19] = val ?? this.defaults.lightMap
        this.refreshParamsSystem(this)
    }

    public get lightMapIntensity() {
        return this.materialParams[20]
    }
    public set lightMapIntensity(val: number | undefined) {
        this.materialParams[20] = val ?? this.defaults.lightMapIntensity
        this.refreshParamsSystem(this)
    }

    public get metalnessMap() {
        return this.materialParams[21]
    }
    public set metalnessMap(val: string | undefined) {
        this.materialParams[21] = val ?? this.defaults.metalnessMap
        this.refreshParamsSystem(this)
    }

    public get metalness() {
        return this.materialParams[22]
    }
    public set metalness(val: number | undefined) {
        this.materialParams[22] = val ?? this.defaults.metalness
        this.refreshParamsSystem(this)
    }

    public get roughnessMap() {
        return this.materialParams[23]
    }
    public set roughnessMap(val: string | undefined) {
        this.materialParams[23] = val ?? this.defaults.roughnessMap
        this.refreshParamsSystem(this)
    }

    public get roughness() {
        return this.materialParams[24]
    }
    public set roughness(val: number | undefined) {
        this.materialParams[24] = val ?? this.defaults.roughness
        this.refreshParamsSystem(this)
    }

    public get normalMap() {
        return this.materialParams[25]
    }
    public set normalMap(val: string | undefined) {
        this.materialParams[25] = val ?? this.defaults.normalMap
        this.refreshParamsSystem(this)
    }

    public get normalScale() {
        return this.materialParams[26]
    }
    public set normalScale(val: number | undefined) {
        this.materialParams[26] = val ?? this.defaults.normalScale
        this.refreshParamsSystem(this)
    }
}
