import { TextureLoader, Texture, RepeatWrapping, DataTexture } from "three"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import Events from "@lincode/events"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"

const cache = new Map<string, Texture>()
const textureLoader = new TextureLoader()
const rgbeLoader = new RGBELoader()
const loaded = new Events()

export default (url: string, onLoad?: () => void) => {
    onLoad && loaded.once(url, () => queueMicrotask(onLoad))

    const texture = forceGet(cache, url, () => {
        const unpkg = url.startsWith("https://unpkg.com/")
        unpkg && increaseLoadingUnpkgCount()

        const hdr = url.toLowerCase().endsWith(".hdr")
        const loader = hdr ? rgbeLoader : textureLoader

        return loader.load(
            url,
            (texture) => {
                texture.wrapS = texture.wrapT = RepeatWrapping
                texture.flipY = texture.userData.flipY ? false : true
                texture.userData.flipped = true
                loaded.setState(url)

                unpkg && decreaseLoadingUnpkgCount()
            },
            handleProgress(url)
        )
    })
    return texture.constructor === DataTexture ? texture : texture.clone()
}
