import { TextureLoader, Texture, RepeatWrapping } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import { assetsPathPtr } from "../../../pointers/assetsPathPointers"
import { loadTextureSet } from "../../../collections/loadTextureSet"

const textureLoader = new TextureLoader()
const rgbeLoader = new RGBELoader()

Texture.DEFAULT_ANISOTROPY = 8

export default (url: string, onLoad?: () => void) => {
    const isAssets = url.startsWith(assetsPathPtr[0])
    isAssets && increaseLoadingAssetsCount()

    const hdr = url.toLowerCase().endsWith(".hdr")
    const loader = hdr ? rgbeLoader : textureLoader

    const texture = loader.load(
        url,
        () => {
            onLoad?.()
            isAssets && decreaseLoadingAssetsCount()
        },
        handleProgress(url)
    )
    texture.wrapS = texture.wrapT = RepeatWrapping
    loadTextureSet.add(texture)
    return texture
}
