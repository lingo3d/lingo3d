import settings from "../api/settings"
import SpriteSheet from "../display/SpriteSheet"

const spriteSheet = new SpriteSheet()
spriteSheet.srcStart = "explosion/explosion00-frame004.png"
spriteSheet.srcEnd = "explosion/explosion00-frame100.png"
spriteSheet.scale = 4
settings.bloom = true
settings.bloomIntensity = 10
settings.bloomThreshold = 0.2