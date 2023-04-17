import Model from "../display/Model"

const model = new Model()
model.src = "bentley1.glb"

model.onLoad = () => {
    for (const part of model.findAll()) {
    }
}
