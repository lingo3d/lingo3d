import { MeshStandardMaterial } from "three"
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

    private _wireframe?: boolean
    public get wireframe() {
        return this._wireframe
    }
    public set wireframe(val) {
        this._wireframe = val
        this.material.wireframe = !!val
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

    private _envMapIntensity?: number
    public get envMapIntensity() {
        return this._envMapIntensity
    }
    public set envMapIntensity(val) {
        this._envMapIntensity = val
        this.material.envMapIntensity = val ?? 1
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

    private _aoMapIntensity?: number
    public get aoMapIntensity() {
        return this._aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this._aoMapIntensity = val
        this.material.aoMapIntensity = val ?? 1
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

    private _bumpScale?: number
    public get bumpScale() {
        return this._bumpScale
    }
    public set bumpScale(val) {
        this._bumpScale = val
        this.material.bumpScale = val ?? 1
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

    private _displacementScale?: number
    public get displacementScale() {
        return this._displacementScale
    }
    public set displacementScale(val) {
        this._displacementScale = val
        this.material.displacementScale = val ?? 1
    }

    private _displacementBias?: number
    public get displacementBias() {
        return this._displacementBias
    }
    public set displacementBias(val) {
        this._displacementBias = val
        this.material.displacementBias = val ?? 0
    }

    private _emissiveIntensity?: number
    public get emissiveIntensity() {
        return this._emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this._emissiveIntensity = val
        this.material.emissiveIntensity = val ?? 1
    }

    private _emissive?: boolean
    public get emissive() {
        return this._emissive
    }
    public set emissive(val) {
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

    private _lightMapIntensity?: number
    public get lightMapIntensity() {
        return this._lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this._lightMapIntensity = val
        this.material.lightMapIntensity = val ?? 1
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

    private _metalness?: number
    public get metalness() {
        return this._metalness
    }
    public set metalness(val) {
        this._metalness = val
        this.material.metalness = val ?? 0
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

    private _roughness?: number
    public get roughness() {
        return this._roughness
    }
    public set roughness(val) {
        this._roughness = val
        this.material.roughness = val ?? 1
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

    private _normalScale?: number
    public get normalScale() {
        return this._normalScale
    }
    public set normalScale(val) {
        this._normalScale = val
        this.material.normalScale.set(val ?? 1, val ?? 1)
    }
}
