import createInternalSystem from "../utils/createInternalSystem"
import { Object3D } from "three"

export const configParentSystem = createInternalSystem("configParentSystem", {
    data: {} as { parent: Object3D },
    effect: (self: Object3D, data) => {
        data.parent.add(self)
    }
})
