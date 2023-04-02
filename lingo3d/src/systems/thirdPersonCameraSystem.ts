import { mapRange } from "@lincode/math"
import MeshAppendable from "../api/core/MeshAppendable"
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import { physxPtr } from "../pointers/physxPtr"
import { assignPxVec, assignPxVec_ } from "../engine/physx/pxMath"
import fpsAlpha from "../display/utils/fpsAlpha"
import getWorldDirection from "../display/utils/getWorldDirection"
import getWorldPosition from "../display/utils/getWorldPosition"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"
import { vector3_ } from "../display/utils/reusables"
import renderSystemWithData from "./utils/renderSystemWithData"
import { managerActorPtrMap } from "../collections/pxCollections"
import { fpsPtr } from "../pointers/fpsPtr"

export const [addThirdPersonCameraSystem, deleteThirdPersonCameraSystem] =
    renderSystemWithData(
        (
            self: ThirdPersonCamera,
            data: {
                found: MeshAppendable
                lerpCount: number
            }
        ) => {
            const cam = self.camera

            const { innerZ } = self
            self.innerZ = 0
            const origin = self.object3d.getWorldPosition(vector3_)
            self.innerZ = innerZ

            const position = getWorldPosition(self.object3d)

            const pxHit = physxPtr[0].pxRaycast?.(
                assignPxVec(origin),
                assignPxVec_(getWorldDirection(self.object3d)),
                position.distanceTo(origin),
                managerActorPtrMap.get(data.found)
            )
            if (pxHit) {
                cam.position.lerp(pxHit.position, fpsAlpha(0.2))
                data.lerpCount = fpsPtr[0]
            } else {
                cam.position.lerp(
                    position,
                    fpsAlpha(mapRange(data.lerpCount, fpsPtr[0], 0, 0.2, 1))
                )
                if (data.lerpCount) data.lerpCount--
            }

            cam.quaternion.copy(getWorldQuaternion(self.object3d))
        }
    )
