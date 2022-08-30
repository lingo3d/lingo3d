import { Vector3, SphereBufferGeometry } from "three"
import settings from "../api/settings"
import Sky from "../display/Sky"
import loadTexture from "../display/utils/loaders/loadTexture"
import Water from "../display/Water"
import scene from "../engine/scene"
import { onBeforeRender } from "../events/onBeforeRender"

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