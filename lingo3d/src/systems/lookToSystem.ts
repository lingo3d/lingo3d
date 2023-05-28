import { Quaternion } from "three"
import fpsAlpha from "../display/utils/fpsAlpha"
import MeshAppendable from "../display/core/MeshAppendable"
import gameSystem from "./utils/gameSystem"

export const lookToSystem = gameSystem({
    data: {} as {
        quaternion: Quaternion
        quaternionNew: Quaternion
        a1?: number
    },
    update: (self: MeshAppendable, data) => {
        const { quaternion, quaternionNew, a1 } = data
        quaternion.slerp(quaternionNew, fpsAlpha(a1 ?? 0.05))

        const x = Math.abs(quaternion.x - quaternionNew.x)
        const y = Math.abs(quaternion.y - quaternionNew.y)
        const z = Math.abs(quaternion.z - quaternionNew.z)
        const w = Math.abs(quaternion.w - quaternionNew.w)
        if (x + y + z + w < 0.001) {
            lookToSystem.delete(self)
            self.onLookToEnd?.()
            quaternion.copy(quaternionNew)
        }
    }
})
