import PooledPrimitve from "../../display/core/PooledPrimitive"
import configSystemWithCleanUp2 from "../utils/configSystemWithCleanUp2"

export const [addRefreshPooledPrimitiveSystem] = configSystemWithCleanUp2(
    (self: PooledPrimitve) =>
        (self.object3d.geometry = self.$requestGeometry(
            self.$getParams() as any
        )),
    (self) => self.$releaseGeometry(self.object3d.geometry as any)
)
