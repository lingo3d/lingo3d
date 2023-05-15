import { Object3D } from "three"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"

export const draggingItemPtr: [
    Appendable | MeshAppendable | Object3D | undefined
] = [undefined]
