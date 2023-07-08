import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { materialPool } from "../../pools/materialPool"
import createInternalSystem from "../utils/createInternalSystem"

export const configMaterialSystem = createInternalSystem(
    "configMaterialSystem",
    {
        effect: (target: TexturedStandardMixin) => {
            target.$material = materialPool.request(target.$materialParams)
            target.$material.transparent &&
                ssrExcludeSet.add(target.$object)
        },
        cleanup: (target) => {
            materialPool.release(target.$material)
            ssrExcludeSet.delete(target.$object)
        }
    }
)
