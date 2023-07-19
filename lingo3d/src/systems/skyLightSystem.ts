import { csmMaterialSet } from "../collections/csmMaterialSet"
import SkyLight from "../display/lights/SkyLight"
import createInternalSystem from "./utils/createInternalSystem"

export const skyLightSystem = createInternalSystem("skyLightSystem", {
    update: (self: SkyLight) => {
        const csm = self.$csm
        if (csm) {
            if (csmMaterialSet.size) {
                for (const material of csmMaterialSet) {
                    csm.setupMaterial(material)
                    self.$csmMaterials.add(material)
                }
                csmMaterialSet.clear()
            }
            csm.lightDirection
                .copy(self.position)
                .normalize()
                .multiplyScalar(-1)
            csm.update()
        }
        self.$backLight.position.copy(self.position).multiplyScalar(-1)
    },
    effect: () => {},
    cleanup: (self) => {
        for (const material of self.$csmMaterials) csmMaterialSet.add(material)
    }
})
