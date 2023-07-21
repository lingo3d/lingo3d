import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import { onUnload } from "../events/onUnload"

export const appendableRoot = new Set<Appendable | MeshAppendable>()

onUnload(() => {
    for (const child of appendableRoot) child.dispose()
})
