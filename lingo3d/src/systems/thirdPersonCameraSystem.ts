import { mapRange } from "@lincode/math"
import MeshAppendable from "../api/core/MeshAppendable"
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import { physxPtr } from "../display/core/PhysicsObjectManager/physx/physxPtr"
import { managerActorPtrMap } from "../display/core/PhysicsObjectManager/physx/pxMaps"
import {
    assignPxVec,
    assignPxVec_
} from "../display/core/PhysicsObjectManager/physx/pxMath"
import fpsAlpha from "../display/utils/fpsAlpha"
import getWorldDirection from "../display/utils/getWorldDirection"
import getWorldPosition from "../display/utils/getWorldPosition"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"
import { vector3_ } from "../display/utils/reusables"
import { fpsPtr } from "../states/useFps"
import renderSystemWithData from "../utils/renderSystemWithData"

export const [addThirdCameraSystem, deleteThirdCameraSystem] =
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
