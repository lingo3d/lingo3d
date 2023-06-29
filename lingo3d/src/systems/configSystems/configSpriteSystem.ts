import Sprite from "../../display/Sprite"
import { texturePool } from "../../pools/texturePool"
import createInternalSystem from "../utils/createInternalSystem"

export const configSpriteSystem = createInternalSystem("configSpriteSystem", {
    effect: (self: Sprite) => {
        if (self.texture)
            self.$material.map = texturePool.request([
                self.texture,
                self.textureRepeat,
                self.textureFlipY,
                self.textureRotation
            ])
        if (self.alphaMap)
            self.$material.alphaMap = texturePool.request([
                self.alphaMap,
                self.textureRepeat,
                self.textureFlipY,
                self.textureRotation
            ])
    },
    cleanup: (self) => {
        if (self.$material.map) {
            texturePool.release(self.$material.map)
            self.$material.map = null
        }
        if (self.$material.alphaMap) {
            texturePool.release(self.$material.alphaMap)
            self.$material.alphaMap = null
        }
    }
})
