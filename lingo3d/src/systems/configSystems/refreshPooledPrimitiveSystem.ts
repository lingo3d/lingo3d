import PooledPrimitve from "../../display/core/PooledPrimitive"
import configSystem from "../utils/configSystem"

export const [
    addRefreshPooledPrimitiveSystem,
    deleteRefreshPooledPrimitiveSystem
] = configSystem((target: PooledPrimitve) => {
    target.$decreaseGeometry(target.$paramString)
    const params = target.$getParams()
    target.object3d.geometry = target.$increaseGeometry(
        params as any,
        (target.$paramString = JSON.stringify(params))
    )
})
