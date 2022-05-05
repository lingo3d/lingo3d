import Model from "../display/Model"
//@ts-ignore
import modelSrc from "../../assets-local/123.fbx"

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