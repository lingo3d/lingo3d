import { Object3D } from "three"
import ITexturedBasic, {
    texturedBasicSchema
} from "../../../interface/ITexturedBasic"
import { attachBasicMaterialManager } from "../../material/attachMaterialManager"

abstract class TexturedBasicMixin {
    public declare nativeObject3d: Object3D
}
Object.assign(TexturedBasicMixin.prototype, {
    getMaterial(this: TexturedBasicMixin) {
        return attachBasicMaterialManager(this.nativeObject3d)[0]
    }
})

interface TexturedBasicMixin extends ITexturedBasic {}
for (const name of Object.keys(texturedBasicSchema))
    Object.defineProperty(TexturedBasicMixin.prototype, name, {
        get() {
            return this.getMaterial()?.[name]
        },
        set(val) {
            const material = this.getMaterial()
            if (!material) return
            material[name] = val
        }
    })
export default TexturedBasicMixin
