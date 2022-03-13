import { CubeTextureLoader, Texture } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"

const cache = new Map<string, Texture>()
const loader = new CubeTextureLoader()

export default (urls: Array<string>) => forceGet(cache, urls.sort().join(","), () => {
    increaseLoadingCount()
    return loader.load(urls,
        () => decreaseLoadingCount(),
        undefined,
        () => decreaseLoadingCount()
    )
})