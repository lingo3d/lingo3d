import { Texture, RepeatWrapping, EquirectangularReflectionMapping } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { rgbeLoader, textureLoader } from "./loadTexture"

const cache = new Map<string, Promise<Texture>>()

export default (url: string) => forceGet(cache, url, () => {
    increaseLoadingCount()

    const hdr = url.endsWith(".hdr")
    const loader = hdr ? rgbeLoader : textureLoader
    
    return new Promise(resolve => {
        loader.load(url,
            texture => {
                if (hdr)
                    texture.mapping = EquirectangularReflectionMapping
                else
                    texture.wrapS = texture.wrapT = RepeatWrapping

                decreaseLoadingCount()
                resolve(texture)
            },
            handleProgress,
            () => decreaseLoadingCount()
        )
    })
})