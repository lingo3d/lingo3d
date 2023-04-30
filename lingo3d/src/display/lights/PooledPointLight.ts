import { lazy } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import {
    releasePointLight,
    requestPointLight
} from "../../pools/objectPools/pointLightPool"
import IPooledPointLight, {
    pooledPointLightDefaults,
    pooledPointLightSchema
} from "../../interface/IPooledPointLight"
import { ColorString } from "../../interface/ITexturedStandard"
import { Sphere } from "three"
import {
    addPooledPointLightSystem,
    deletePooledPointLightSystem
} from "../../systems/pooledPointLightSystem"

const initPointLight = lazy(() => {
    for (let i = 0; i < 4; ++i) {
        const pointLight = requestPointLight([], "")
        releasePointLight(pointLight)
    }
})

export default class PooledPointLight
    extends ObjectManager
    implements IPooledPointLight
{
    public static componentName = "pooledPointLight"
    public static defaults = pooledPointLightDefaults
    public static schema = pooledPointLightSchema

    public constructor() {
        super()
        initPointLight()
        addPooledPointLightSystem(this, { visible: false, light: undefined })
    }

    protected override disposeNode() {
        super.disposeNode()
        deletePooledPointLightSystem(this)
    }

    public $boundingSphere = new Sphere()
    public distance = 500
    public intensity = 10
    public shadows = true
    public color: ColorString = "#ffffff"
}
