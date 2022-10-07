import ITexturedStandard from "../../../interface/ITexturedStandard"
import { attachStandardMaterialManager } from "../../material/attachMaterialManager"
import TexturedBasicMixin from "./TexturedBasicMixin"

export default abstract class TexturedStandardMixin
    extends TexturedBasicMixin
    implements ITexturedStandard
{
    protected override getMaterial() {
        return attachStandardMaterialManager(this.nativeObject3d)!
    }

    public get wireframe() {
        return this.getMaterial().wireframe
    }
    public set wireframe(val) {
        this.getMaterial().wireframe = val
    }

    public get envMap() {
        return this.getMaterial().envMap
    }
    public set envMap(val) {
        this.getMaterial().envMap = val
    }

    public get envMapIntensity() {
        return this.getMaterial().envMapIntensity
    }
    public set envMapIntensity(val) {
        this.getMaterial().envMapIntensity = val
    }

    public get aoMap() {
        return this.getMaterial().aoMap
    }
    public set aoMap(val) {
        this.getMaterial().aoMap = val
    }

    public get aoMapIntensity() {
        return this.getMaterial().aoMapIntensity
    }
    public set aoMapIntensity(val) {
        this.getMaterial().aoMapIntensity = val
    }

    public get bumpMap() {
        return this.getMaterial().bumpMap
    }
    public set bumpMap(val) {
        this.getMaterial().bumpMap = val
    }

    public get bumpScale() {
        return this.getMaterial().bumpScale
    }
    public set bumpScale(val) {
        this.getMaterial().bumpScale = val
    }

    public get displacementMap() {
        return this.getMaterial().displacementMap
    }
    public set displacementMap(val) {
        this.getMaterial().displacementMap = val
    }

    public get displacementScale() {
        return this.getMaterial().displacementScale
    }
    public set displacementScale(val) {
        this.getMaterial().displacementScale = val
    }

    public get displacementBias() {
        return this.getMaterial().displacementBias
    }
    public set displacementBias(val) {
        this.getMaterial().displacementBias = val
    }

    public get emissiveColor() {
        return this.getMaterial().emissiveColor
    }
    public set emissiveColor(val) {
        this.getMaterial().emissiveColor = val
    }

    public get emissiveMap() {
        return this.getMaterial().emissiveMap
    }
    public set emissiveMap(val) {
        this.getMaterial().emissiveMap = val
    }

    public get emissiveIntensity() {
        return this.getMaterial().emissiveIntensity
    }
    public set emissiveIntensity(val) {
        this.getMaterial().emissiveIntensity = val
    }

    public get emissive() {
        return this.getMaterial().emissive
    }
    public set emissive(val) {
        this.getMaterial().emissive = val
    }

    public get lightMap() {
        return this.getMaterial().lightMap
    }
    public set lightMap(val) {
        this.getMaterial().lightMap = val
    }

    public get lightMapIntensity() {
        return this.getMaterial().lightMapIntensity
    }
    public set lightMapIntensity(val) {
        this.getMaterial().lightMapIntensity = val
    }

    public get metalnessMap() {
        return this.getMaterial().metalnessMap
    }
    public set metalnessMap(val) {
        this.getMaterial().metalnessMap = val
    }

    public get metalness() {
        return this.getMaterial().metalness
    }
    public set metalness(val) {
        this.getMaterial().metalness = val
    }

    public get roughnessMap() {
        return this.getMaterial().roughnessMap
    }
    public set roughnessMap(val) {
        this.getMaterial().roughnessMap = val
    }

    public get roughness() {
        return this.getMaterial().roughness
    }
    public set roughness(val) {
        this.getMaterial().roughness = val
    }

    public get normalMap() {
        return this.getMaterial().normalMap
    }
    public set normalMap(val) {
        this.getMaterial().normalMap = val
    }

    public get normalScale() {
        return this.getMaterial().normalScale
    }
    public set normalScale(val) {
        this.getMaterial().normalScale = val
    }
}
