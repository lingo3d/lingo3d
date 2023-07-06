import PooledSpotLight from "../display/lights/PooledSpotLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import { spotLightPool } from "../pools/objectPools/spotLightPool"
import { spotLightPoolPtr } from "../pointers/spotLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"

let count = 0

export const pooledSpotLightSystem = createInternalSystem(
    "pooledSpotLightSystem",
    {
        data: { visible: false, poolSize: spotLightPoolPtr[0] },
        afterTick: () => {
            count = 0
        },
        update: (self: PooledSpotLight, data) => {
            const visible =
                data.poolSize === spotLightPoolPtr[0]
                    ? !!getIntensityFactor(self) &&
                      ++count <= spotLightPoolPtr[0]
                    : false
            if (visible && !data.visible) {
                if (!spotLightPool.releasedObjects.size) return
                self.$light = spotLightPool.request([], "", self)
            } else if (!visible && data.visible) {
                spotLightPool.release(self.$light)
                self.$light = undefined
            }
            data.visible = visible
            data.poolSize = spotLightPoolPtr[0]
        },
        effect: () => {},
        cleanup: (self) => {
            spotLightPool.release(self.$light)
            self.$light = undefined
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
