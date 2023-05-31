import PooledPrimitve from "../../display/core/PooledPrimitive"
import createSystem from "../utils/createSystem"

export const refreshPooledPrimitiveSystem = createSystem(
    "refreshPooledPrimitiveSystem",
    {
        effect: (self: PooledPrimitve) => {
            self.object3d.geometry = self.$requestGeometry(
                self.$getParams() as any
            )
        },
        cleanup: (self) => self.$releaseGeometry(self.object3d.geometry as any)
    }
)
