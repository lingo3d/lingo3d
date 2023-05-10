import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { releaseMaterial, requestMaterial } from "../../pools/materialPool"
import configSystemWithCleanUp2 from "../utils/configSystemWithCleanUp2"

export const [addRefreshTexturedStandardSystem] = configSystemWithCleanUp2(
    (target: TexturedStandardMixin) => {
        target.$material = requestMaterial(
            target.$materialParams,
            (target.$materialParamString = JSON.stringify(
                target.$materialParams
            ))
        )
    },
    (target) => {
        releaseMaterial(target.$materialParamString!)
        target.$materialParamString = undefined
    }
)
