import { Object3D } from "three"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"

export const draggingItemPtr: [
    Appendable | MeshAppendable | Object3D | undefined
] = [undefined]
