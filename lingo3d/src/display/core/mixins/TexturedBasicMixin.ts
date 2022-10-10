import Appendable from "../../../api/core/Appendable"
import ITexturedBasic, {
    texturedBasicSchema
} from "../../../interface/ITexturedBasic"
import { attachBasicMaterialManager } from "../../material/attachMaterialManager"

abstract class TexturedBasicMixin {}
Object.assign(TexturedBasicMixin.prototype, {
    getMaterial(this: Appendable) {
        return attachBasicMaterialManager(this.nativeObject3d, this)[0]
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
