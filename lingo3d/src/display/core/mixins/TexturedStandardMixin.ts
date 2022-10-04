import { Color, MeshStandardMaterial, Vector2 } from "three"
import ITexturedStandard from "../../../interface/ITexturedStandard"
import loadTexture from "../../utils/loaders/loadTexture"
import TexturedBasicMixin from "./TexturedBasicMixin"

const mapNames = [
    "map",
    "alphaMap",
    "envMap",
    "aoMap",
    "bumpMap",
    "displacementMap",
    "emissiveMap",
    "lightMap",
    "metalnessMap",
    "roughnessMap",
    "normalMap"
]

export default abstract class TexturedStandardMixin
    extends TexturedBasicMixin
    implements ITexturedStandard
{
    protected abstract override material: MeshStandardMaterial

    public get wireframe() {
        return this.material.wireframe
    }
    public set wireframe(val) {
        this.tryCloneMaterial()
        this.material.wireframe = val
    }

    private _envMap?: string
    public get envMap() {
        return this._envMap
    }
    public set envMap(val) {
        this.tryCloneMaterial()
        this._envMap = val
        this.material.envMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get envMapIntensity() {
        return this.material.envMapIntensity
    }
    public set envMapIntensity(val) {
        this.tryCloneMaterial()
        this.material.envMapIntensity = val
    }

    private _aoMap?: string
    public get aoMap() {
        return this._aoMap
    }
    public set aoMap(val) {
        this.tryCloneMaterial()
        this._aoMap = val
        this.material.aoMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get aoMapIntensity() {
        return this.material.aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this.tryCloneMaterial()
        this.material.aoMapIntensity = val
    }

    private _bumpMap?: string
    public get bumpMap() {
        return this._bumpMap
    }
    public set bumpMap(val) {
        this.tryCloneMaterial()
        this._bumpMap = val
        this.material.bumpMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get bumpScale() {
        return this.material.bumpScale
    }
    public set bumpScale(val) {
        this.tryCloneMaterial()
        this.material.bumpScale = val
    }

    private _displacementMap?: string
    public get displacementMap() {
        return this._displacementMap
    }
    public set displacementMap(val) {
        this.tryCloneMaterial()
        this._displacementMap = val
        this.material.displacementMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get displacementScale() {
        return this.material.displacementScale
    }
    public set displacementScale(val) {
        this.tryCloneMaterial()
        this.material.displacementScale = val
    }

    public get displacementBias() {
        return this.material.displacementBias
    }
    public set displacementBias(val) {
        this.tryCloneMaterial()
        this.material.displacementBias = val
    }

    public get emissiveColor() {
        return "#" + this.material.emissive.getHexString()
    }
    public set emissiveColor(val) {
        this.tryCloneMaterial()
        this.material.emissive = new Color(val)
    }

    private _emissiveMap?: string
    public get emissiveMap() {
        return this._emissiveMap
    }
    public set emissiveMap(val) {
        this.tryCloneMaterial()
        this._emissiveMap = val
        this.material.emissiveMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get emissiveIntensity() {
        return this.material.emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this.tryCloneMaterial()
        this.material.emissiveIntensity = val
    }

    private _emissive?: boolean
    public get emissive() {
        return !!this._emissive
    }
    public set emissive(val: boolean) {
        this._emissive = val
        if (!val) return
        this.tryCloneMaterial()
        this.material.emissiveMap = this.material.map
        this.material.emissive = this.material.color
        //todo: make this property reversible
    }

    private _lightMap?: string
    public get lightMap() {
        return this._lightMap
    }
    public set lightMap(val) {
        this.tryCloneMaterial()
        this._lightMap = val
        this.material.lightMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get lightMapIntensity() {
        return this.material.lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this.tryCloneMaterial()
        this.material.lightMapIntensity = val
    }

    private _metalnessMap?: string
    public get metalnessMap() {
        return this._metalnessMap
    }
    public set metalnessMap(val) {
        this.tryCloneMaterial()
        this._metalnessMap = val
        this.material.metalnessMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get metalness() {
        return this.material.metalness
    }
    public set metalness(val) {
        this.tryCloneMaterial()
        this.material.metalness = val
    }

    private _roughnessMap?: string
    public get roughnessMap() {
        return this._roughnessMap
    }
    public set roughnessMap(val) {
        this.tryCloneMaterial()
        this._roughnessMap = val
        this.material.roughnessMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get roughness() {
        return this.material.roughness
    }
    public set roughness(val) {
        this.tryCloneMaterial()
        this.material.roughness = val
    }

    private _normalMap?: string
    public get normalMap() {
        return this._normalMap
    }
    public set normalMap(val) {
        this.tryCloneMaterial()
        this._normalMap = val
        this.material.normalMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get normalScale() {
        return this.material.normalScale
    }
    public set normalScale(val: Vector2 | number) {
        this.tryCloneMaterial()
        if (typeof val === "number")
            this.material.normalScale = new Vector2(val, val)
        else this.material.normalScale = val
    }
}
