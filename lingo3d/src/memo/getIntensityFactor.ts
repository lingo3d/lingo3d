import { mapRange } from "@lincode/math"
import { CM2M } from "../globals"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { lightDistancePtr } from "../pointers/lightDistancePtr"
import { getDistanceFromCamera } from "./getDistanceFromCamera"
import getFrustum from "./getFrustum"
import getWorldPosition from "./getWorldPosition"
import computePerFrame from "./utils/computePerFrame"
import PointLightBase from "../display/core/PointLightBase"
import PooledPointLightBase from "../display/core/PooledPointLightBase"

export default computePerFrame((self: PointLightBase<any> | PooledPointLightBase<any>) =>
    getFrustum(cameraRenderedPtr[0]).intersectsSphere(
        self.$boundingSphere.set(
            getWorldPosition(self.$innerObject),
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
