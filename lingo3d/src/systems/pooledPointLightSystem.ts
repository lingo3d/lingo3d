import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import { pointLightPool } from "../pools/objectPools/pointLightPool"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"

let count = 0

export const pooledPointLightSystem = createInternalSystem(
    "pooledPointLightSystem",
    {
        data: { visible: false, poolSize: pointLightPoolPtr[0] },
        afterTick: () => {
            count = 0
        },
        update: (self: PooledPointLight, data) => {
            const visible =
                data.poolSize === pointLightPoolPtr[0]
                    ? !!getIntensityFactor(self) &&
                      ++count <= pointLightPoolPtr[0]
                    : false
            if (visible && !data.visible) {
                if (!pointLightPool.releasedObjects.size) return
                self.$light = pointLightPool.request([], "", self)
            } else if (!visible && data.visible) {
                pointLightPool.release(self.$light)
                self.$light = undefined
            }
            data.visible = visible
            data.poolSize = pointLightPoolPtr[0]
        },
        effect: () => {},
        cleanup: (self) => {
            pointLightPool.release(self.$light)
            self.$light = undefined
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
