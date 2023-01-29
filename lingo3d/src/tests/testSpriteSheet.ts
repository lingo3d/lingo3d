import settings from "../api/settings"
import SpriteSheet from "../display/SpriteSheet"
import { TEXTURES_URL } from "../globals"

const spriteSheet = new SpriteSheet()
// spriteSheet.textureStart = "explosion/explosion00-frame004.png"
// spriteSheet.textureEnd = "explosion/explosion00-frame100.png"

spriteSheet.texture = "explosion0"
spriteSheet.columns = 5
spriteSheet.length = 98

spriteSheet.scale = 4
settings.bloom = true
settings.bloomIntensity = 10
settings.bloomThreshold = 0.2
