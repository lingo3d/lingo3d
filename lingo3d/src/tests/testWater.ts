import settings from "../api/settings"
import Water from "../display/Water"

export default {}

settings.skybox = [
    "skybox/Left.png",
    "skybox/Right.png",
    "skybox/Up.png",
    "skybox/Down.png",
    "skybox/Front.png",
    "skybox/Back.png"
]

const water = new Water()
water.scale = 100
water.shape = "sphere"
