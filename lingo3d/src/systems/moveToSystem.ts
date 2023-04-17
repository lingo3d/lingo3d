import { vertexAngle, Point, rotatePoint } from "@lincode/math"
import renderSystemWithData from "./utils/renderSystemWithData"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import { addUpdatePhysicsSystem } from "./configSystems/updatePhysicsSystem"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import MeshAppendable from "../api/core/MeshAppendable"

export const [addMoveToSystem, deleteMoveToSystem] = renderSystemWithData(
    (
        self: MeshAppendable | PhysicsObjectManager,
        data: {
            sx: number
            sy: number
            sz: number
            x: number
            y: number | undefined
            z: number
            quad: number
        }
    ) => {
        self.x += data.sx * fpsRatioPtr[0]
        if (data.y !== undefined) self.y += data.sy * fpsRatioPtr[0]
        self.z += data.sz * fpsRatioPtr[0]

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
            deleteMoveToSystem(self)
            self.onMoveToEnd?.()
        }
        addUpdatePhysicsSystem(self)
    }
)
