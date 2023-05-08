import scene from "../scene"
import GPUPicker from "./GPUPicker"

const picker = new GPUPicker()

export default {}

setInterval(() => {
    console.log(scene.getObjectById(picker.pick(0, 0)))
}, 1000)
