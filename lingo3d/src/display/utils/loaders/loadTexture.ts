import { TextureLoader, Texture, RepeatWrapping } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

const cache = new Map<string, Texture>()
export const textureLoader = new TextureLoader()
export const rgbeLoader = new RGBELoader()

export default (url: string, onLoad?: () => void) => forceGet(cache, url, () => {
    increaseLoadingCount()

    const hdr = url.endsWith(".hdr")
    const loader = hdr ? rgbeLoader : textureLoader

    return loader.load(url,
        texture => {
            texture.wrapS = texture.wrapT = RepeatWrapping
            decreaseLoadingCount()
        },
        handleProgress,
        () => {
            onLoad?.()
            decreaseLoadingCount()
        }
    )
})