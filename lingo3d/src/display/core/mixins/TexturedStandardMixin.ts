import ITexturedStandard, {
    texturedStandardSchema
} from "../../../interface/ITexturedStandard"
import { attachStandardMaterialManager } from "../../material/attachMaterialManager"
import StandardMaterialManager from "../../material/StandardMaterialManager"
import TexturedBasicMixin from "./TexturedBasicMixin"

abstract class TexturedStandardMixin extends TexturedBasicMixin {}

Object.assign(TexturedBasicMixin.prototype, {
    getMaterial(this: TexturedStandardMixin): StandardMaterialManager {
        return attachStandardMaterialManager(this.nativeObject3d)[0]
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
