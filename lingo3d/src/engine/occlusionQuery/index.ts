import { nativeIdMap } from "../../collections/idCollections"
import scene from "../scene"
import GPUPicker from "./GPUPicker"

const picker = new GPUPicker()

export default {}

setInterval(() => {
    picker.pick()
}, 100)
