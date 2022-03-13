import { TextureLoader, Texture, RepeatWrapping } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"

const cache = new Map<string, Texture>()
export const textureLoader = new TextureLoader()

export default (url: string) => forceGet(cache, url, () => {
    increaseLoadingCount()
    return textureLoader.load(url,
        texture => {
            texture.wrapS = texture.wrapT = RepeatWrapping
            decreaseLoadingCount()
        },
        undefined,
        () => decreaseLoadingCount()
    )
})