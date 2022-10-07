import { Color, MeshStandardMaterial } from "three"
import ITexturedStandard from "../../interface/ITexturedStandard"
import loadTexture from "../utils/loaders/loadTexture"
import BasicMaterialManager from "./BasicMaterialManager"

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

export default class StandardMaterialManager
    extends BasicMaterialManager<MeshStandardMaterial>
    implements ITexturedStandard
{
    public constructor(material: MeshStandardMaterial) {
        super(material)
    }

    public get wireframe() {
        return this.material.wireframe
    }
    public set wireframe(val) {
        this.material.wireframe = val
    }

    private _envMap?: string
    public get envMap() {
        return this._envMap
    }
    public set envMap(val) {
        this._envMap = val
        this.material.envMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get envMapIntensity() {
        return this.material.envMapIntensity
    }
    public set envMapIntensity(val) {
        this.material.envMapIntensity = val
    }

    private _aoMap?: string
    public get aoMap() {
        return this._aoMap
    }
    public set aoMap(val) {
        this._aoMap = val
        this.material.aoMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get aoMapIntensity() {
        return this.material.aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this.material.aoMapIntensity = val
    }

    private _bumpMap?: string
    public get bumpMap() {
        return this._bumpMap
    }
    public set bumpMap(val) {
        this._bumpMap = val
        this.material.bumpMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get bumpScale() {
        return this.material.bumpScale
    }
    public set bumpScale(val) {
        this.material.bumpScale = val
    }

    private _displacementMap?: string
    public get displacementMap() {
        return this._displacementMap
    }
    public set displacementMap(val) {
        this._displacementMap = val
        this.material.displacementMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get displacementScale() {
        return this.material.displacementScale
    }
    public set displacementScale(val) {
        this.material.displacementScale = val
    }

    public get displacementBias() {
        return this.material.displacementBias
    }
    public set displacementBias(val) {
        this.material.displacementBias = val
    }

    public get emissiveColor() {
        return "#" + this.material.emissive.getHexString()
    }
    public set emissiveColor(val) {
        this.material.emissive = new Color(val)
    }

    private _emissiveMap?: string
    public get emissiveMap() {
        return this._emissiveMap
    }
    public set emissiveMap(val) {
        this._emissiveMap = val
        this.material.emissiveMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get emissiveIntensity() {
        return this.material.emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this.material.emissiveIntensity = val
    }

    private _emissive?: boolean
    public get emissive() {
        return !!this._emissive
    }
    public set emissive(val: boolean) {
        this._emissive = val
        if (!val) return
        this.material.emissiveMap = this.material.map
        this.material.emissive = this.material.color
        //todo: make this property reversible
    }

    private _lightMap?: string
    public get lightMap() {
        return this._lightMap
    }
    public set lightMap(val) {
        this._lightMap = val
        this.material.lightMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get lightMapIntensity() {
        return this.material.lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this.material.lightMapIntensity = val
    }

    private _metalnessMap?: string
    public get metalnessMap() {
        return this._metalnessMap
    }
    public set metalnessMap(val) {
        this._metalnessMap = val
        this.material.metalnessMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get metalness() {
        return this.material.metalness
    }
    public set metalness(val) {
        this.material.metalness = val
    }

    private _roughnessMap?: string
    public get roughnessMap() {
        return this._roughnessMap
    }
    public set roughnessMap(val) {
        this._roughnessMap = val
        this.material.roughnessMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get roughness() {
        return this.material.roughness
    }
    public set roughness(val) {
        this.material.roughness = val
    }

    private _normalMap?: string
    public get normalMap() {
        return this._normalMap
    }
    public set normalMap(val) {
        this._normalMap = val
        this.material.normalMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    public get normalScale() {
        return this.material.normalScale.x
    }
    public set normalScale(val: number) {
        this.material.normalScale.set(val, val)
    }
}
