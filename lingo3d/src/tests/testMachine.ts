import Model from "../display/Model"
//@ts-ignore
import modelSrc from "../../assets-local/2.fbx"

export default {}

const model = new Model()
model.src = modelSrc
model.onLoad = () => {
    const found = model.find("Hose001")
    if (found) {
        found.animation = true
    }
}