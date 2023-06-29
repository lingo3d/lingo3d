import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { materialPool } from "../../pools/materialPool"
import createInternalSystem from "../utils/createInternalSystem"

export const refreshTexturedStandardSystem = createInternalSystem(
    "refreshTexturedStandardSystem",
    {
        effect: (target: TexturedStandardMixin) => {
            target.$material = materialPool.request(target.$materialParams)
            target.$material.transparent &&
                ssrExcludeSet.add(target.outerObject3d)
        },
        cleanup: (target) => {
            materialPool.release(target.$material)
            ssrExcludeSet.delete(target.outerObject3d)
        }
    }
)
