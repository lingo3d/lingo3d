import { Vector3 } from "three"
import PositionedMixin from "../display/core/mixins/PositionedMixin"
import fpsAlpha from "../display/utils/fpsAlpha"
import renderSystemWithData from "./utils/renderSystemWithData"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"

export const [addLerpToSystem, deleteLerpToSystem] = renderSystemWithData(
    (
        self: PositionedMixin | PhysicsObjectManager,
        data: {
            from: Vector3
            to: Vector3
            alpha: number
        }
    ) => {
        const { x, y, z } = data.from.lerp(data.to, fpsAlpha(data.alpha))

        if (
            Math.abs(self.x - x) < 0.1 &&
            Math.abs(self.y - y) < 0.1 &&
            Math.abs(self.z - z) < 0.1
        ) {
            self.cancelHandle("lerpTo", undefined)
            self.onMoveToEnd?.()
        }
        self.x = x
        self.y = y
        self.z = z
        "updatePhysicsTransform" in self && self.updatePhysicsTransform()
    }
)
