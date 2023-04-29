import { lazy } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import {
    releasePointLight,
    requestPointLight
} from "../../pools/objectPools/pointLightPool"
import IPooledPointLight from "../../interface/IPooledPointLight"
import PointLight from "./PointLight"
import { ColorString } from "../../interface/ITexturedStandard"

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
    private light: PointLight

    public constructor() {
        super()
        initPointLight()
        this.light = requestPointLight([], "")
    }
    public distance = 500
    public intensity = 10
    public shadows = true
    public color: ColorString = "#ffffff"
}
