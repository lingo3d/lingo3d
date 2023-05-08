import { getExtensionType } from "@lincode/filetypes"
import { deg2Rad, Point } from "@lincode/math"
import { Texture } from "three"
import loadTexture from "../../../utils/loaders/loadTexture"
import loadVideoTexture, {
    isSelector
} from "../../../utils/loaders/loadVideoTexture"
import { uuidTextureMap } from "../../../../collections/idCollections"

const initMap = (
    map: Texture,
    textureRepeat: number | Point,
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

export default (
    texture: string,
    textureRepeat: number | Point,
    textureFlipY: boolean,
    textureRotation: number
) => {
    if (!texture) return

    if (uuidTextureMap.has(texture)) return uuidTextureMap.get(texture)

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
}
