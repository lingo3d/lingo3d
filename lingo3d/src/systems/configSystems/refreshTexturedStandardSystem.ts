import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import TexturedStandardMixin from "../../display/core/mixins/TexturedStandardMixin"
import { releaseMaterial, requestMaterial } from "../../pools/materialPool"
import createInternalSystem from "../utils/createInternalSystem"

export const refreshTexturedStandardSystem = createInternalSystem(
    "refreshTexturedStandardSystem",
    {
        effect: (target: TexturedStandardMixin) => {
            target.$material = requestMaterial(target.$materialParams)
            target.$material.transparent &&
                ssrExcludeSet.add(target.outerObject3d)
        },
        cleanup: (target) => {
            releaseMaterial(target.$material)
            ssrExcludeSet.delete(target.outerObject3d)
        }
    }
)
