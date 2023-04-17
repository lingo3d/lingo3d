import Model from "../display/Model"
import { onBeforeRender } from "../events/onBeforeRender"

const model = new Model()
model.src = "bentley1.glb"

model.onLoad = () => {
    const door = model.find("DoorLeft_169")!
}
