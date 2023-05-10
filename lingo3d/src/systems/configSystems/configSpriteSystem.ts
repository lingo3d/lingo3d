import Sprite from "../../display/Sprite"
import { releaseTexture } from "../../pools/texturePool"
import { requestTexture } from "../../pools/texturePool"
import configSystemWithCleanUp2 from "../utils/configSystemWithCleanUp2"

export const [addConfigSpriteSystem] = configSystemWithCleanUp2(
    (self: Sprite) => {
        if (self.texture) {
            self.$material.map = requestTexture([
                self.texture,
                self.textureRepeat,
                self.textureFlipY,
                self.textureRotation
            ])
        }
        if (self.alphaMap) {
            self.$material.alphaMap = requestTexture([
                self.alphaMap,
                self.textureRepeat,
                self.textureFlipY,
                self.textureRotation
            ])
        }
    },
    (self) => {
        if (self.$material.map) {
            releaseTexture(self.$material.map)
            self.$material.map = null
        }
        if (self.$material.alphaMap) {
            releaseTexture(self.$material.alphaMap)
            self.$material.alphaMap = null
        }
    }
)
