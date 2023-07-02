import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import FoundManager from "../display/core/FoundManager"

export const draggingItemPtr: [
    Appendable | MeshAppendable | FoundManager | undefined
] = [undefined]
