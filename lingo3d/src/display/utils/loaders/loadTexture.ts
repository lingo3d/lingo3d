import { TextureLoader, Texture, RepeatWrapping } from "three"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./utils/bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import Events from "@lincode/events"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import { assetsPathPtr } from "../../../pointers/assetsPathPointers"

const cache = new Map<string, Texture>()
const textureLoader = new TextureLoader()
const rgbeLoader = new RGBELoader()
const loaded = new Events()

Texture.DEFAULT_ANISOTROPY = 8

export default (url: string, onLoad?: () => void) => {
    onLoad && loaded.once(url, () => queueMicrotask(onLoad))

    const texture = forceGet(cache, url, () => {
        const isAssets = url.startsWith(assetsPathPtr[0])
        isAssets && increaseLoadingAssetsCount()

        const hdr = url.toLowerCase().endsWith(".hdr")
        const loader = hdr ? rgbeLoader : textureLoader

        return loader.load(
            url,
            (texture) => {
                texture.wrapS = texture.wrapT = RepeatWrapping
                texture.flipY = texture.userData.flipY ? false : true
                texture.userData.flipped = true
                loaded.setState(url)

                isAssets && decreaseLoadingAssetsCount()
            },
            handleProgress(url)
        )
    })
    return "isDataTexture" in texture ? texture : texture.clone()
}
