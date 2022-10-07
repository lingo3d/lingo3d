import { Object3D } from "three"
import ITexturedBasic from "../../../interface/ITexturedBasic"
import { attachBasicMaterialManager } from "../../material/attachMaterialManager"
import BasicMaterialManager from "../../material/BasicMaterialManager"

export default abstract class TexturedBasicMixin implements ITexturedBasic {
    public declare nativeObject3d: Object3D

    protected declare getMaterial: any

    public get color() {
        return this.getMaterial().color
    }
    public set color(val) {
        this.getMaterial().color = val
    }

    public get opacity() {
        return this.getMaterial().opacity
    }
    public set opacity(val) {
        this.getMaterial().opacity = val
    }

    public get videoTexture() {
        return this.getMaterial().videoTexture
    }
    public set videoTexture(val) {
        this.getMaterial().videoTexture = val
    }

    public get texture() {
        return this.getMaterial().texture
    }
    public set texture(val) {
        this.getMaterial().texture = val
    }

    public get alphaMap() {
        return this.getMaterial().alphaMap
    }
    public set alphaMap(val) {
        this.getMaterial().alphaMap = val
    }

    public get textureRepeat() {
        return this.getMaterial().textureRepeat
    }
    public set textureRepeat(val) {
        this.getMaterial().textureRepeat = val
    }

    public get textureFlipY() {
        return this.getMaterial().textureFlipY
    }
    public set textureFlipY(val) {
        this.getMaterial().textureFlipY = val
    }

    public get textureRotation() {
        return this.getMaterial().textureRotation
    }
    public set textureRotation(val) {
        this.getMaterial().textureRotation = val
    }
}
Object.assign(TexturedBasicMixin.prototype, {
    getMaterial(this: TexturedBasicMixin): BasicMaterialManager<any> {
        return attachBasicMaterialManager(this.nativeObject3d)!
    }
})
