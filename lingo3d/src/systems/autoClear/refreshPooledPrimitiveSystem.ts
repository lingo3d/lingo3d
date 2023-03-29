import PooledPrimitve from "../../display/core/PooledPrimitive"
import renderSystemAutoClear from "../utils/renderSystemAutoClear"

export const [
    addRefreshPooledPrimitiveSystem,
    deleteRefreshPooledPrimitiveSystem
] = renderSystemAutoClear((target: PooledPrimitve) => {
    target.decreaseGeometry(target.paramString)
    const params = target.getParams()
    target.object3d.geometry = target.increaseGeometry(
        params,
        (target.paramString = JSON.stringify(params))
    )
})
