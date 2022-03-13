import { Color, MeshStandardMaterial, ObjectSpaceNormalMap, TangentSpaceNormalMap, Texture, Vector2 } from "three"
import ITexturedStandard, { NormalMapType } from "../../../interface/ITexturedStandard"
import loadTexture from "../../utils/loaders/loadTexture"

export default abstract class TexturedStandardMixin implements ITexturedStandard {
    protected abstract material: MeshStandardMaterial

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val: string) {
        this.material.color = new Color(val)
    }

    public get emissiveColor() {
        return "#" + this.material.emissive.getHexString()
    }
    public set emissiveColor(val: string) {
        this.material.emissive = new Color(val)
    }

    public get flatShading() {
        return this.material.flatShading
    }
    public set flatShading(val: boolean) {
        this.material.flatShading = val
    }

    public get wireframe() {
        return this.material.wireframe
    }
    public set wireframe(val: boolean) {
        this.material.wireframe = val
    }

    private _envMap?: string
    public get envMap() {
        return this._envMap
    }
    public set envMap(val: string | undefined) {
        this._envMap = val
        this.material.envMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.envMap)
    }

    private _aoMap?: string
    public get aoMap() {
        return this._aoMap
    }
    public set aoMap(val: string | undefined) {
        this._aoMap = val
        this.material.aoMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.aoMap)
    }

    public get aoMapIntensity() {
        return this.material.aoMapIntensity
    }
    public set aoMapIntensity(val: number) {
        this.material.aoMapIntensity = val
    }

    private _bumpMap?: string
    public get bumpMap() {
        return this._bumpMap
    }
    public set bumpMap(val: string | undefined) {
        this._bumpMap = val
        this.material.bumpMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.bumpMap)
    }

    public get bumpScale() {
        return this.material.bumpScale
    }
    public set bumpScale(val: number) {
        this.material.bumpScale = val
    }

    private _displacementMap?: string
    public get displacementMap() {
        return this._displacementMap
    }
    public set displacementMap(val: string | undefined) {
        this._displacementMap = val
        this.material.displacementMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.displacementMap)
    }

    public get displacementScale() {
        return this.material.displacementScale
    }
    public set displacementScale(val: number) {
        this.material.displacementScale = val
    }

    public get displacementBias() {
        return this.material.displacementBias
    }
    public set displacementBias(val: number) {
        this.material.displacementBias = val
    }

    private _emissiveMap?: string
    public get emissiveMap() {
        return this._emissiveMap
    }
    public set emissiveMap(val: string | undefined) {
        this._emissiveMap = val
        this.material.emissiveMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.emissiveMap)
    }

    public get emissiveIntensity() {
        return this.material.emissiveIntensity
    }
    public set emissiveIntensity(val: number) {
        this.material.emissiveIntensity = val
    }

    private _lightMap?: string
    public get lightMap() {
        return this._lightMap
    }
    public set lightMap(val: string | undefined) {
        this._lightMap = val
        this.material.lightMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.lightMap)
    }

    public get lightMapIntensity() {
        return this.material.lightMapIntensity
    }
    public set lightMapIntensity(val: number) {
        this.material.lightMapIntensity = val
    }

    private _metalnessMap?: string
    public get metalnessMap() {
        return this._metalnessMap
    }
    public set metalnessMap(val: string | undefined) {
        this._metalnessMap = val
        this.material.metalnessMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.metalnessMap)
    }

    public get metalness() {
        return this.material.metalness
    }
    public set metalness(val: number) {
        this.material.metalness = val
    }

    private _roughnessMap?: string
    public get roughnessMap() {
        return this._roughnessMap
    }
    public set roughnessMap(val: string | undefined) {
        this._roughnessMap = val
        this.material.roughnessMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.roughnessMap)
    }

    public get roughness() {
        return this.material.roughness
    }
    public set roughness(val: number) {
        this.material.roughness = val
    }

    private _normalMap?: string
    public get normalMap() {
        return this._normalMap
    }
    public set normalMap(val: string | undefined) {
        this._normalMap = val
        this.material.normalMap = val ? loadTexture(val) : null
        //@ts-ignore
        this.applyTextureRepeat(this.material.normalMap)
    }

    public get normalScale() {
        return this.material.normalScale
    }
    public set normalScale(val: Vector2 | number) {
        if (typeof val === "number")
            this.material.normalScale = new Vector2(val, val)
        else
            this.material.normalScale = val
    }

    private _normalMapType?: NormalMapType
    public get normalMapType() {
        return this._normalMapType
    }
    public set normalMapType(val: NormalMapType | undefined) {
        this._normalMapType = val
        this.material.normalMapType = val === "objectSpace" ? ObjectSpaceNormalMap : TangentSpaceNormalMap
    }

    public get refractionRatio() {
        return this.material.refractionRatio
    }
    public set refractionRatio(val: number) {
        this.material.refractionRatio = val
    }
}