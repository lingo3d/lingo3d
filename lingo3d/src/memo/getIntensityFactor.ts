import { mapRange } from "@lincode/math"
import { CM2M } from "../globals"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { lightDistancePtr } from "../pointers/lightDistancePtr"
import { getDistanceFromCamera } from "./getDistanceFromCamera"
import getFrustum from "./getFrustum"
import getWorldPosition from "./getWorldPosition"
import computePerFrame from "./utils/computePerFrame"
import PointLightBase from "../display/core/PointLightBase"
import PooledPointLight from "../display/lights/PooledPointLight"
import PooledSpotLight from "../display/lights/PooledSpotLight"

export default computePerFrame((self: PointLightBase | PooledPointLight | PooledSpotLight) =>
    getFrustum(cameraRenderedPtr[0]).intersectsSphere(
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
)
