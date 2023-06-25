import { Quaternion } from "three"
import MeshAppendable from "../display/core/MeshAppendable"
import createInternalSystem from "./utils/createInternalSystem"
import { configPhysicsTransformSystem } from "./configSystems/configPhysicsTransformSystem"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import frameSync from "../api/frameSync"

export const lookToSystem = createInternalSystem("lookToSystem", {
    data: {} as {
        quaternion: Quaternion
        quaternionNew: Quaternion
        a1?: number
    },
    update: (self: MeshAppendable | PhysicsObjectManager, data) => {
        const { quaternion, quaternionNew, a1 } = data
        quaternion.slerp(quaternionNew, frameSync(a1 ?? 0.05))

        const x = Math.abs(quaternion.x - quaternionNew.x)
        const y = Math.abs(quaternion.y - quaternionNew.y)
        const z = Math.abs(quaternion.z - quaternionNew.z)
        const w = Math.abs(quaternion.w - quaternionNew.w)
        if (x + y + z + w < 0.001) {
            lookToSystem.delete(self)
            self.onLookToEnd?.()
            quaternion.copy(quaternionNew)
        }
        "$actor" in self &&
            self.$actor &&
            configPhysicsTransformSystem.add(self)
    }
})
