import Model from "../display/Model"
//@ts-ignore
import modelSrc from "../../assets-local/123.fbx"
import Camera from "../display/cameras/Camera"

export default {}

const model = new Model()
model.src = modelSrc
model.onLoad = () => {
    const found = model.find("Hose001")
    if (found) {
        let anim = found.animation = true
        found.onClick = () => {
            found.animation = anim = !anim
        }
    }
}
model.animation = true

const cam = new Camera()