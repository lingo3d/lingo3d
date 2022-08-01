import Model from "../display/Model"

export default {}

const model = new Model()
model.src = "fox/Fox.fbx"
model.animations = {
    idle: "fox/Idle.fbx"
}
model.animation = "idle"
