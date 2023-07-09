import MeshAppendable from "../display/core/MeshAppendable"
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import { physxPtr } from "../pointers/physxPtr"
import { assignPxVec, assignPxVec_ } from "../engine/physx/pxMath"
import getWorldDirection from "../memo/getWorldDirection"
import getWorldPosition from "../memo/getWorldPosition"
import getWorldQuaternion from "../memo/getWorldQuaternion"
import { vector3_ } from "../display/utils/reusables"
import { managerActorPtrMap } from "../collections/pxCollections"
import { fpsPtr } from "../pointers/fpsPtr"
import createInternalSystem from "./utils/createInternalSystem"
import { frameSyncAlpha } from "../api/frameSync"
import { mapLinear } from "three/src/math/MathUtils"

export const thirdPersonCameraSystem = createInternalSystem(
    "thirdPersonCameraSystem",
    {
        data: {} as {
            found: MeshAppendable
            lerpCount: number
        },
        update: (self: ThirdPersonCamera, data) => {
            const cam = self.$camera

            const { innerZ } = self
            self.innerZ = 0
            const origin = self.$innerObject.getWorldPosition(vector3_)
            self.innerZ = innerZ

            const position = getWorldPosition(self.$innerObject)

            const pxHit = physxPtr[0].pxRaycast?.(
                assignPxVec(origin),
                assignPxVec_(getWorldDirection(self.$innerObject)),
                position.distanceTo(origin),
                managerActorPtrMap.get(data.found)
            )
            if (pxHit) {
                cam.position.lerp(pxHit.position, frameSyncAlpha(0.2))
                data.lerpCount = fpsPtr[0]
            } else {
                cam.position.lerp(
                    position,
                    frameSyncAlpha(
                        mapLinear(data.lerpCount, fpsPtr[0], 0, 0.2, 1)
                    )
                )
                if (data.lerpCount) data.lerpCount--
            }

            cam.quaternion.copy(getWorldQuaternion(self.$innerObject))
        }
    }
)
