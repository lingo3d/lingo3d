import { TextureLoader, Texture, RepeatWrapping } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { loadTextureSet } from "../../../collections/loadTextureSet"
import { busyCountPtr } from "../../../pointers/busyCountPtr"

const textureLoader = new TextureLoader()
const rgbeLoader = new RGBELoader()

Texture.DEFAULT_ANISOTROPY = 8

export default (url: string, onLoad?: () => void) => {
    busyCountPtr[0]++

    const hdr = url.toLowerCase().endsWith(".hdr")
    const loader = hdr ? rgbeLoader : textureLoader

    const texture = loader.load(
        url,
        () => {
            busyCountPtr[0]--
            onLoad?.()
        },
        handleProgress(url),
        () => busyCountPtr[0]--
    )
    texture.wrapS = texture.wrapT = RepeatWrapping
    loadTextureSet.add(texture)
    return texture
}
