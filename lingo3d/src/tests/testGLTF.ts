import settings from "../api/settings"
import Model from "../display/Model"

const model = new Model()
model.src = "car/porsche.glb"
model.animationRepeat = 2
model.onAnimationFinish = () => console.log("done")

settings.environment = "day"
