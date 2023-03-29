import TexturedStandardMixin from "../display/core/mixins/TexturedStandardMixin"
import { decreaseMaterial, increaseMaterial } from "../pools/materialPool"
import renderSystemAutoClear from "./utils/renderSystemAutoClear"

export const [addRefreshTexturedStandardSystem] = renderSystemAutoClear(
    (target: TexturedStandardMixin) => {
        if (target.materialParamString)
            decreaseMaterial(target.materialParamString)
        else target.then(() => decreaseMaterial(target.materialParamString!))
        const paramString = JSON.stringify(target.materialParams)
        target.material = increaseMaterial(target.materialParams, paramString)
        target.materialParamString = paramString
    }
)
