import PooledPrimitve from "../../display/core/PooledPrimitive"
import createSystem from "../utils/createSystem"

export const refreshPooledPrimitiveSystem = createSystem({
    setup: (self: PooledPrimitve) => {
        self.object3d.geometry = self.$requestGeometry(self.$getParams() as any)
        console.log("setup")
    },
    cleanup: (self) => {
        self.$releaseGeometry(self.object3d.geometry as any)
        console.log("cleanup")
    }
})
