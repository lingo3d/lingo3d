import { EquirectangularReflectionMapping, DataTexture } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

const cache = new Map<string, DataTexture>()
const loader = new RGBELoader()

export default (url: string) => forceGet(cache, url, () => {
    increaseLoadingCount()

    return loader.load(url,
        texture => {
            texture.mapping = EquirectangularReflectionMapping
            decreaseLoadingCount()
        },
        handleProgress,
        () => decreaseLoadingCount()
    )
})