import { TextureLoader, Texture, RepeatWrapping } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import Events from "@lincode/events"

const cache = new Map<string, Texture>()
export const textureLoader = new TextureLoader()
export const rgbeLoader = new RGBELoader()
const loaded = new Events()

export default (url: string, onLoad?: () => void) => {
    onLoad && loaded.once(url, () => queueMicrotask(onLoad))

    return forceGet(cache, url, () => {
        increaseLoadingCount()

        const hdr = url.toLowerCase().toLowerCase().endsWith(".hdr")
        const loader = hdr ? rgbeLoader : textureLoader

        return loader.load(url,
            texture => {
                texture.wrapS = texture.wrapT = RepeatWrapping
                loaded.setState(url)
                decreaseLoadingCount()
            },
            handleProgress,
            () => {
                loaded.setState(url)
                decreaseLoadingCount()
            }
        )
    })
}