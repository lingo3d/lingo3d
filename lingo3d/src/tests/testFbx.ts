import Model from "../display/Model"
import { onBeforeRender } from "../events/onBeforeRender"
import getRendered from "../memo/getRendered"

const model = new Model()
model.src = "rig2.fbx"
model.scale = 100

onBeforeRender(() => {
    getRendered()
})