import Model from "../display/Model"

const model = new Model()
model.src = "123.fbx"
model.onLoad = () => {
    const found = model.find("Hose001")
    if (found) {
        let anim = found.animation = true
        found.onClick = () => {
            found.animation = anim = !anim
        }
    }
}