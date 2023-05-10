import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { releaseMaterial, requestMaterial } from "../../pools/materialPool"
import configSystem from "../utils/configSystem"

export const [addRefreshTexturedStandardSystem] = configSystem(
    (target: TexturedStandardMixin) => {
        if (target.$materialParamString)
            releaseMaterial(target.$materialParamString)
        else target.then(() => releaseMaterial(target.$materialParamString!))
        const paramString = JSON.stringify(target.$materialParams)
        target.$material = requestMaterial(target.$materialParams, paramString)
        target.$materialParamString = paramString
    }
)
