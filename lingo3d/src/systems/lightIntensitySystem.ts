import { mapRange } from "@lincode/math"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import renderSystem from "./utils/renderSystem"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import { lightDistancePtr } from "../pointers/lightDistancePtr"
import getFrustum from "../utilsCached/getFrustum"
import getWorldPosition from "../utilsCached/getWorldPosition"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { CM2M } from "../globals"

export const [addLightIntensitySystem, deleteLightIntensitySystem] =
    renderSystem((self: PointLight | SpotLight) => {
        self._intensityFactor = getFrustum(
            cameraRenderedPtr[0]
        ).intersectsSphere(
            self._boundingSphere.set(
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
        self._enabledFactor = !!self._intensityFactor
        self.object3d.intensity = self.intensity * self._intensityFactor
        self.object3d.visible = !!(
            (self.enabled as any) * (self._enabledFactor as any)
        )
    })
