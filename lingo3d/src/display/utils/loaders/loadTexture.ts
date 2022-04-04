import { TextureLoader, Texture, RepeatWrapping, EquirectangularReflectionMapping } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

const cache = new Map<string, Texture>()
export const textureLoader = new TextureLoader()
export const rgbeLoader = new RGBELoader()

export default (url: string) => forceGet(cache, url, () => {
    increaseLoadingCount()

    const hdr = url.endsWith(".hdr")
    const loader = hdr ? rgbeLoader : textureLoader

    return loader.load(url,
        texture => {
            if (hdr)
                texture.mapping = EquirectangularReflectionMapping
            else
                texture.wrapS = texture.wrapT = RepeatWrapping

            decreaseLoadingCount()
        },
        handleProgress,
        () => decreaseLoadingCount()
    )
})