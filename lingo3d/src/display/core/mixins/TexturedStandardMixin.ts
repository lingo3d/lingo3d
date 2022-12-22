import MeshAppendable from "../../../api/core/MeshAppendable"
import ITexturedStandard, {
    texturedStandardSchema
} from "../../../interface/ITexturedStandard"
import { attachStandardMaterialManager } from "../../material/attachMaterialManager"
import TexturedBasicMixin from "./TexturedBasicMixin"

abstract class TexturedStandardMixin extends TexturedBasicMixin {}

Object.assign(TexturedBasicMixin.prototype, {
    getMaterial(this: MeshAppendable) {
        return attachStandardMaterialManager(this.object3d, this)[0]
    }
})

interface TexturedStandardMixin extends TexturedBasicMixin, ITexturedStandard {}
for (const name of Object.keys(texturedStandardSchema))
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
export default TexturedStandardMixin
