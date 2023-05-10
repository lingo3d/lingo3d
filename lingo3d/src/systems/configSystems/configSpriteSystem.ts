import { Texture, Vector2 } from "three"
import Sprite from "../../display/Sprite"
import configSystem from "../utils/configSystem"
import { deg2Rad } from "@lincode/math"

const initMap = (self: Sprite, map: Texture) => {
    typeof self.textureRepeat === "number"
        ? map.repeat.set(self.textureRepeat, self.textureRepeat)
        : map.repeat.copy(self.textureRepeat as Vector2)

    map.flipY = self.textureFlipY
    map.rotation = self.textureRotation * deg2Rad
}

export const [addConfigSpriteSystem] = configSystem((self: Sprite) => {
    const { map, alphaMap } = self.$material
    map && initMap(self, map)
    alphaMap && initMap(self, alphaMap)
})
