import { Vector3 } from "three"
import fpsAlpha from "../display/utils/fpsAlpha"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import { addConfigPhysicsSystem } from "./configLoadedSystems/configPhysicsSystem"
import MeshAppendable from "../display/core/MeshAppendable"
import createSystem from "./utils/createSystem"

export const lerpToSystem = createSystem("lerpToSystem", {
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
        addConfigPhysicsSystem(self)
    }
})
