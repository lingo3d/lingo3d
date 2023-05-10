import { Texture } from "three"
import createInstancePool from "./utils/createInstancePool"
import { PointType } from "../utils/isPoint"
import { deg2Rad } from "@lincode/math"
import { getExtensionType } from "@lincode/filetypes"
import { uuidTextureMap } from "../collections/idCollections"
import loadTexture from "../display/utils/loaders/loadTexture"
import loadVideoTexture from "../display/utils/loaders/loadVideoTexture"
import { isSelector } from "../utils/isSelector"

export type TextureParams = [
    texture: string,
    textureRepeat: number | PointType,
    textureFlipY: boolean,
    textureRotation: number
]

const initMap = (
    map: Texture,
    textureRepeat: number | PointType,
    textureFlipY: boolean,
    textureRotation: number
) => {
    typeof textureRepeat === "number"
        ? map.repeat.set(textureRepeat, textureRepeat)
        : map.repeat.set(textureRepeat.x, textureRepeat.y)
    if (map.userData.needsUpdate) map.needsUpdate = true
    map.userData.needsUpdate = true
    map.flipY = map.userData.flipY = map.userData.flipped
        ? !textureFlipY
        : textureFlipY
    map.rotation = textureRotation * deg2Rad
    return map
}

export const [increaseTexture, decreaseTexture] = createInstancePool<
    Texture,
    TextureParams
>(
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
