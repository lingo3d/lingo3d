import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { releaseMaterial, requestMaterial } from "../../pools/materialPool"
import createSystem from "../utils/createSystem"

export const refreshTexturedStandardSystem = createSystem(
    "refreshTexturedStandardSystem",
    {
        setup: (target: TexturedStandardMixin) => {
            target.$material = requestMaterial(target.$materialParams)
        },
        cleanup: (target) => releaseMaterial(target.$material)
    }
)
