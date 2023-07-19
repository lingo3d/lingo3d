import scene from "../engine/scene"
import throttleFrame from "./utils/throttleFrame"
import { rendererPtr } from "../pointers/rendererPtr"

export default throttleFrame(() =>
    rendererPtr[0].renderLists.get(scene, 0).opaque.map((item) => item.object)
)
