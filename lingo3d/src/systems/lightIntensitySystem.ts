import { mapRange } from "@lincode/math"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import renderSystem from "./utils/renderSystem"
import { lightDistancePtr } from "../pointers/lightDistancePtr"
import getFrustum from "../utilsCached/getFrustum"
import getWorldPosition from "../utilsCached/getWorldPosition"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { CM2M } from "../globals"
import PointLightBase from "../display/core/PointLightBase"

export const [addLightIntensitySystem, deleteLightIntensitySystem] =
    renderSystem((self: PointLightBase<any>) => {
        const intensityFactor = getFrustum(
            cameraRenderedPtr[0]
        ).intersectsSphere(
            self.$boundingSphere.set(
                getWorldPosition(self.object3d),
                self.distance * CM2M
            )
        )
            ? mapRange(
                  getDistanceFromCamera(self),
                  0,
                  lightDistancePtr[0],
                  1,
                  0,
                  true
              )
            : 0
        self.object3d.intensity = self.intensity * intensityFactor
        self.object3d.visible = self.enabled && !!intensityFactor
    })
