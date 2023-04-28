import { lazy } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import {
    releasePointLight,
    requestPointLight
} from "../../pools/objectPools/pointLightPool"

const initPointLight = lazy(() => {
    for (let i = 0; i < 4; ++i) {
        const pointLight = requestPointLight([], "")
        releasePointLight(pointLight)
    }
})

export default class PooledPointLight extends ObjectManager {
    public constructor() {
        super()
        initPointLight()
        const light = requestPointLight([], "")
        //mark
    }
}
