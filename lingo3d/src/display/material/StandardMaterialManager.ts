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
        this.nativeMaterial.wireframe = !!val
    }

    private _envMap?: string
    public get envMap() {
        return this._envMap
    }
    public set envMap(val) {
        this._envMap = val
        this.nativeMaterial.envMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _envMapIntensity?: number
    public get envMapIntensity() {
        return this._envMapIntensity
    }
    public set envMapIntensity(val) {
        this._envMapIntensity = val
        this.nativeMaterial.envMapIntensity = val ?? 1
    }

    private _aoMap?: string
    public get aoMap() {
        return this._aoMap
    }
    public set aoMap(val) {
        this._aoMap = val
        this.nativeMaterial.aoMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _aoMapIntensity?: number
    public get aoMapIntensity() {
        return this._aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this._aoMapIntensity = val
        this.nativeMaterial.aoMapIntensity = val ?? 1
    }

    private _bumpMap?: string
    public get bumpMap() {
        return this._bumpMap
    }
    public set bumpMap(val) {
        this._bumpMap = val
        this.nativeMaterial.bumpMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _bumpScale?: number
    public get bumpScale() {
        return this._bumpScale
    }
    public set bumpScale(val) {
        this._bumpScale = val
        this.nativeMaterial.bumpScale = val ?? 1
    }

    private _displacementMap?: string
    public get displacementMap() {
        return this._displacementMap
    }
    public set displacementMap(val) {
        this._displacementMap = val
        this.nativeMaterial.displacementMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _displacementScale?: number
    public get displacementScale() {
        return this._displacementScale
    }
    public set displacementScale(val) {
        this._displacementScale = val
        this.nativeMaterial.displacementScale = val ?? 1
    }

    private _displacementBias?: number
    public get displacementBias() {
        return this._displacementBias
    }
    public set displacementBias(val) {
        this._displacementBias = val
        this.nativeMaterial.displacementBias = val ?? 0
    }

    private _emissiveIntensity?: number
    public get emissiveIntensity() {
        return this._emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this._emissiveIntensity = val
        this.nativeMaterial.emissiveIntensity = val ?? 1
    }

    private _emissive?: boolean
    public get emissive() {
        return this._emissive
    }
    public set emissive(val) {
        this._emissive = val
        if (!val) return
        this.nativeMaterial.emissiveMap = this.nativeMaterial.map
        this.nativeMaterial.emissive = this.nativeMaterial.color
        //todo: make this property reversible
    }

    private _lightMap?: string
    public get lightMap() {
        return this._lightMap
    }
    public set lightMap(val) {
        this._lightMap = val
        this.nativeMaterial.lightMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _lightMapIntensity?: number
    public get lightMapIntensity() {
        return this._lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this._lightMapIntensity = val
        this.nativeMaterial.lightMapIntensity = val ?? 1
    }

    private _metalnessMap?: string
    public get metalnessMap() {
        return this._metalnessMap
    }
    public set metalnessMap(val) {
        this._metalnessMap = val
        this.nativeMaterial.metalnessMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _metalness?: number
    public get metalness() {
        return this._metalness
    }
    public set metalness(val) {
        this._metalness = val
        this.nativeMaterial.metalness = val ?? 0
    }

    private _roughnessMap?: string
    public get roughnessMap() {
        return this._roughnessMap
    }
    public set roughnessMap(val) {
        this._roughnessMap = val
        this.nativeMaterial.roughnessMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _roughness?: number
    public get roughness() {
        return this._roughness
    }
    public set roughness(val) {
        this._roughness = val
        this.nativeMaterial.roughness = val ?? 1
    }

    private _normalMap?: string
    public get normalMap() {
        return this._normalMap
    }
    public set normalMap(val) {
        this._normalMap = val
        this.nativeMaterial.normalMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    private _normalScale?: number
    public get normalScale() {
        return this._normalScale
    }
    public set normalScale(val) {
        this._normalScale = val
        this.nativeMaterial.normalScale.set(val ?? 1, val ?? 1)
    }
}
