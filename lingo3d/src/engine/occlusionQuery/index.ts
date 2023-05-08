import scene from "../scene"
import GPUPicker from "./GPUPicker"

const picker = new GPUPicker(256, 256)

export default {}

setInterval(() => {
    console.log(scene.getObjectById(picker.pick(256, 256)))
}, 1000)
