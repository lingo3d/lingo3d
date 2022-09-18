import { TextureLoader, Texture, RepeatWrapping } from "three"
import { forceGet } from "@lincode/utils"
import { handleProgress } from "./bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import Events from "@lincode/events"

const cache = new Map<string, Texture>()
const textureLoader = new TextureLoader()
const rgbeLoader = new RGBELoader()
const loaded = new Events()

export default (url: string, onLoad?: () => void) => {
    onLoad && loaded.once(url, () => queueMicrotask(onLoad))

    return forceGet(cache, url, () => {
        const hdr = url.toLowerCase().endsWith(".hdr")
        const loader = hdr ? rgbeLoader : textureLoader

        return loader.load(
            url,
            (texture) => {
                texture.wrapS = texture.wrapT = RepeatWrapping
                loaded.setState(url)
            },
            handleProgress(url),
            () => loaded.setState(url)
        )
    })
}
