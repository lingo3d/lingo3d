import { Color, MeshStandardMaterial } from "three"
import IStandardMaterialManager, {
    standardMaterialManagerDefaults,
    standardMaterialManagerSchema
} from "../../interface/IStandardMaterialManager"
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
    implements IStandardMaterialManager
{
    public static override componentName = "standardMaterial"
    public static override defaults = standardMaterialManagerDefaults
    public static override schema = standardMaterialManagerSchema

    public get wireframe() {
        return this.nativeMaterial.wireframe
    }
    public set wireframe(val) {
        this.nativeMaterial.wireframe = val
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

    public get envMapIntensity() {
        return this.nativeMaterial.envMapIntensity
    }
    public set envMapIntensity(val) {
        this.nativeMaterial.envMapIntensity = val
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

    public get aoMapIntensity() {
        return this.nativeMaterial.aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this.nativeMaterial.aoMapIntensity = val
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

    public get bumpScale() {
        return this.nativeMaterial.bumpScale
    }
    public set bumpScale(val) {
        this.nativeMaterial.bumpScale = val
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

    public get displacementScale() {
        return this.nativeMaterial.displacementScale
    }
    public set displacementScale(val) {
        this.nativeMaterial.displacementScale = val
    }

    public get displacementBias() {
        return this.nativeMaterial.displacementBias
    }
    public set displacementBias(val) {
        this.nativeMaterial.displacementBias = val
    }

    public get emissiveIntensity() {
        return this.nativeMaterial.emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this.nativeMaterial.emissiveIntensity = val
    }

    public get emissive() {
        return this.nativeMaterial.emissive.getHexString() !== "000000"
    }
    public set emissive(val) {
        this.nativeMaterial.emissive = val
            ? this.nativeMaterial.color
            : new Color(0)
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

    public get lightMapIntensity() {
        return this.nativeMaterial.lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this.nativeMaterial.lightMapIntensity = val
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

    public get metalness() {
        return this.nativeMaterial.metalness
    }
    public set metalness(val) {
        this.nativeMaterial.metalness = val
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

    public get roughness() {
        return this.nativeMaterial.roughness
    }
    public set roughness(val) {
        this.nativeMaterial.roughness = val
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

    public get normalScale() {
        return this.nativeMaterial.normalScale.x
    }
    public set normalScale(val) {
        this.nativeMaterial.normalScale.set(val, val)
    }
}
