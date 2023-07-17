import { TextureLoader, Texture, RepeatWrapping } from "three"
import { handleProgress } from "./utils/bytesLoaded"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { loadTextureSet } from "../../../collections/loadTextureSet"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

const textureLoader = new TextureLoader()
const rgbeLoader = new RGBELoader()

Texture.DEFAULT_ANISOTROPY = 4

export default (url: string, onLoad?: (texture: Texture) => void) => {
    addBusyProcess("loadTexture")

    const hdr = url.toLowerCase().endsWith(".hdr")
    const loader = hdr ? rgbeLoader : textureLoader

    const texture = loader.load(
        url,
        () => {
            deleteBusyProcess("loadTexture")
            onLoad?.(texture)
        },
        handleProgress(url),
        () => {
            deleteBusyProcess("loadTexture")
        }
    )
    texture.wrapS = texture.wrapT = RepeatWrapping
    loadTextureSet.add(texture)
    return texture
}
