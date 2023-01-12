import { getExtensionType } from "@lincode/filetypes"
import { deg2Rad, Point } from "@lincode/math"
import { Texture } from "three"
import loadTexture from "../../../utils/loaders/loadTexture"
import loadVideoTexture from "../../../utils/loaders/loadVideoTexture"

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

    if (texture[0] === "#" || texture[0] === ".")
        return initMap(
            loadVideoTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )

    const filetype = getExtensionType(texture)
    if (filetype === "image")
        return initMap(
            loadTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )
    if (filetype === "video")
        return initMap(
            loadVideoTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )
}
