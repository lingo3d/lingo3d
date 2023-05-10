import PooledPrimitve from "../../display/core/PooledPrimitive"
import configSystem from "../utils/configSystem"

export const [addRefreshPooledPrimitiveSystem] = configSystem(
    (target: PooledPrimitve) => {
        target.$releaseGeometry(target.$paramString)
        const params = target.$getParams()
        target.object3d.geometry = target.$requestGeometry(
            params as any,
            (target.$paramString = JSON.stringify(params))
        )
    }
)
