import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { releaseMaterial, requestMaterial } from "../../pools/materialPool"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

export const [addRefreshTexturedStandardSystem] = configSystemWithCleanUp(
    (target: TexturedStandardMixin) => {
        const paramString = JSON.stringify(target.$materialParams)
        target.$material = requestMaterial(target.$materialParams, paramString)
        return () => {
            releaseMaterial(paramString)
        }
    }
)
