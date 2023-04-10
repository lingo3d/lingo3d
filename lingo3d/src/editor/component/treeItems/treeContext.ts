import { Object3D } from "three"
import Appendable from "../../../api/core/Appendable"
import MeshAppendable from "../../../api/core/MeshAppendable"

export default {
    draggingItem: undefined as
        | Appendable
        | MeshAppendable
        | Object3D
        | undefined
}
