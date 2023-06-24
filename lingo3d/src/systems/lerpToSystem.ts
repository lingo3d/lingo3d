import { Vector3 } from "three"
import fpsAlpha from "../display/utils/fpsAlpha"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import MeshAppendable from "../display/core/MeshAppendable"
import createInternalSystem from "./utils/createInternalSystem"
import { configPhysicsTransformSystem } from "./configSystems/configPhysicsTransformSystem"

export const lerpToSystem = createInternalSystem("lerpToSystem", {
    data: {} as {
        from: Vector3
        to: Vector3
        alpha: number
    },
    update: (self: MeshAppendable | PhysicsObjectManager, data) => {
        const { x, y, z } = data.from.lerp(data.to, fpsAlpha(data.alpha))

        if (
            Math.abs(self.x - x) < 0.1 &&
            Math.abs(self.y - y) < 0.1 &&
            Math.abs(self.z - z) < 0.1
        ) {
            lerpToSystem.delete(self)
            self.onMoveToEnd?.()
        }
        self.x = x
        self.y = y
        self.z = z
        "$actor" in self &&
            self.$actor &&
            configPhysicsTransformSystem.add(self)
    }
})
