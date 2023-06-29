import { Texture } from "three"
import createSharedPool from "./utils/createSharedPool"
import { deg2Rad } from "@lincode/math"
import { getExtensionType } from "@lincode/filetypes"
import { uuidTextureMap } from "../collections/idCollections"
import loadTexture from "../display/utils/loaders/loadTexture"
import loadVideoTexture from "../display/utils/loaders/loadVideoTexture"
import { isSelector } from "../utils/isSelector"
import { loadTextureSet } from "../collections/loadTextureSet"

export type TextureParams = [
    texture: string,
    textureRepeat: number,
    textureFlipY: boolean,
    textureRotation: number
]

const initMap = (
    map: Texture,
    textureRepeat: number,
    textureFlipY: boolean,
    textureRotation: number
) => {
    map.repeat.set(textureRepeat, textureRepeat)
    map.flipY = loadTextureSet.has(map) ? !textureFlipY : textureFlipY
    map.rotation = textureRotation * deg2Rad
    return map
}

export const texturePool = createSharedPool<Texture, TextureParams>(
    (params) => {
        const [texture, textureRepeat, textureFlipY, textureRotation] = params
        if (uuidTextureMap.has(texture)) return uuidTextureMap.get(texture)!

        if (isSelector(texture))
            return initMap(
                loadVideoTexture(texture),
                textureRepeat,
                textureFlipY,
                textureRotation
            )
        if (getExtensionType(texture) === "video")
            return initMap(
                loadVideoTexture(texture),
                textureRepeat,
                textureFlipY,
                textureRotation
            )
        return initMap(
            loadTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )
    },
    (texture) => texture.dispose()
)
