import { pointLightPool } from "../../pools/objectPools/pointLightPool"
import IPooledPointLight, {
    pooledPointLightDefaults,
    pooledPointLightSchema
} from "../../interface/IPooledPointLight"
import PointLight from "./PointLight"
import { pointLightPoolPtr } from "../../pointers/pointLightPoolPtr"
import PooledPointLightBase from "../core/PooledPointLightBase"
import { pooledPointLightSystem } from "../../systems/pooledPointLightSystem"
import { createEffect } from "@lincode/reactivity"
import { getPointLightPool } from "../../states/usePointLightPool"
import {
    getPointLightPoolEnabled,
    setPointLightPoolEnabled
} from "../../states/usePointLightPoolEnabled"

createEffect(() => {
    if (!getPointLightPoolEnabled()) return

    const lights: Array<PointLight> = []
    for (let i = 0; i < pointLightPoolPtr[0]; ++i)
        lights.push(pointLightPool.request([], ""))
    for (const light of lights) pointLightPool.release(light)

    return () => {
        pointLightPool.clear()
    }
}, [getPointLightPool, getPointLightPoolEnabled])

export default class PooledPointLight
    extends PooledPointLightBase<PointLight>
    implements IPooledPointLight
{
    public static componentName = "pooledPointLight"
    public static defaults = pooledPointLightDefaults
    public static schema = pooledPointLightSchema

    public constructor() {
        super()
        pooledPointLightSystem.add(this)
        setPointLightPoolEnabled(true)
    }
}
