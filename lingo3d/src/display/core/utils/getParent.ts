import { Object3D } from "three"
import scene from "../../../engine/scene"

export default (item: Object3D) => item.parent ?? scene
