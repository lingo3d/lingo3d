import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import { getSessionToken } from "../states/useSessionToken"

export const appendableRoot = new Set<Appendable | MeshAppendable>()

getSessionToken(() => {
    for (const child of appendableRoot) child.dispose()
})
