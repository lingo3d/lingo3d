import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { releaseMaterial, requestMaterial } from "../../pools/materialPool"
import createInternalSystem from "../utils/createInternalSystem"

export const refreshTexturedStandardSystem = createInternalSystem(
    "refreshTexturedStandardSystem",
    {
        effect: (target: TexturedStandardMixin) => {
            target.$material = requestMaterial(target.$materialParams)
        },
        cleanup: (target) => releaseMaterial(target.$material)
    }
)
