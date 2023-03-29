import { Quaternion } from "three"
import DirectionedMixin from "../display/core/mixins/DirectionedMixin"
import fpsAlpha from "../display/utils/fpsAlpha"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addLookToSystem, deleteLookToSystem] = renderSystemWithData(
    (
        self: DirectionedMixin,
        data: { quaternion: Quaternion; quaternionNew: Quaternion; a1?: number }
    ) => {
        const { quaternion, quaternionNew, a1 } = data
        quaternion.slerp(quaternionNew, fpsAlpha(a1 ?? 0.05))

        const x = Math.abs(quaternion.x - quaternionNew.x)
        const y = Math.abs(quaternion.y - quaternionNew.y)
        const z = Math.abs(quaternion.z - quaternionNew.z)
        const w = Math.abs(quaternion.w - quaternionNew.w)
        if (x + y + z + w < 0.001) {
            self.cancelHandle("lookTo", undefined)
            self.onLookToEnd?.()

            quaternion.copy(quaternionNew)
        }
    }
)
