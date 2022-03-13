import { TextureLoader, Texture, RepeatWrapping } from "three"
import { forceGet } from "@lincode/utils"
import { increaseLoadingCount, decreaseLoadingCount } from "../../../states/useLoadingCount"

const cache = new Map<string, Promise<Texture>>()
const loader = new TextureLoader()

export default (url: string) => forceGet(cache, url, () => {
    increaseLoadingCount()
    return new Promise(resolve => {
        loader.load(url,
            texture => {
                texture.wrapS = texture.wrapT = RepeatWrapping
                decreaseLoadingCount()
                resolve(texture)
            },
            undefined,
            () => decreaseLoadingCount()
        )
    })
})