import PooledPrimitve from "../../display/core/PooledPrimitive"
import createInternalSystem from "../utils/createInternalSystem"

export const configPooledPrimitiveSystem = createInternalSystem(
    "configPooledPrimitiveSystem",
    {
        effect: (self: PooledPrimitve) => {
            self.$innerObject.geometry = self.$geometryPool.request(
                self.$getParams() as any
            )
        },
        cleanup: (self) => {
            self.$geometryPool.release(self.$innerObject.geometry as any)
        }
    }
)
