import { vertexAngle, Point, rotatePoint } from "@lincode/math"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import MeshAppendable from "../display/core/MeshAppendable"
import createInternalSystem from "./utils/createInternalSystem"
import { configPhysicsTransformSystem } from "./configSystems/configPhysicsTransformSystem"
import frameSync from "../api/frameSync"

export const moveToSystem = createInternalSystem("moveToSystem", {
    data: {} as {
        sx: number
        sy: number
        sz: number
        x: number
        y: number | undefined
        z: number
        quad: number
    },
    update: (self: MeshAppendable | PhysicsObjectManager, data) => {
        self.x += frameSync(data.sx)
        if (data.y !== undefined) self.y += frameSync(data.sy)
        self.z += frameSync(data.sz)

        const angle = vertexAngle(
            new Point(self.x, self.z),
            new Point(data.x, data.z),
            new Point(self.x, data.z)
        )
        const rotated = rotatePoint(
            new Point(data.x, data.z),
            new Point(self.x, self.z),
            data.quad === 1 || data.quad === 4 ? angle : -angle
        )
        if (data.z > rotated.y) {
            moveToSystem.delete(self)
            self.onMoveToEnd?.()
        }
        "$actor" in self &&
            self.$actor &&
            configPhysicsTransformSystem.add(self)
    }
})
