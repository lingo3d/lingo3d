import { pointLightPool } from "../../pools/objectPools/pointLightPool"
import IPooledPointLight, {
    pooledPointLightDefaults,
    pooledPointLightSchema
} from "../../interface/IPooledPointLight"
import PointLight from "./PointLight"
import { onPointLightPool } from "../../events/onPointLightPool"
import { pointLightPoolPtr } from "../../pointers/pointLightPoolPtr"
import PooledPointLightBase from "../core/PooledPointLightBase"
import { pooledPointLightSystem } from "../../systems/pooledPointLightSystem"

const lightSet = new Set<PooledPointLight>()

let requested: PooledPointLight | undefined
const requestPointLights = (self: PooledPointLight) => {
    if (requested) return
    requested = self
    const lights: Array<PointLight> = []
    for (let i = 0; i < pointLightPoolPtr[0]; ++i)
        lights.push(pointLightPool.request([], "", self))
    for (const light of lights) pointLightPool.release(light)
}
onPointLightPool(() => {
    if (!requested) return
    const self = requested
    requested = undefined
    pointLightPool.clear()
    requestPointLights(self)
    for (const light of lightSet) pooledPointLightSystem.add(light)
})

export default class PooledPointLight
    extends PooledPointLightBase<PointLight>
    implements IPooledPointLight
{
    public static componentName = "pooledPointLight"
    public static defaults = pooledPointLightDefaults
    public static schema = pooledPointLightSchema

    public constructor() {
        super()
        requestPointLights(this)
        pooledPointLightSystem.add(this)
        lightSet.add(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        lightSet.delete(this)
    }
}
