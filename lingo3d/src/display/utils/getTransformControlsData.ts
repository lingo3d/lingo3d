import { transformControlsModePtr } from "../../pointers/transformControlsModePtr"
import Appendable from "../core/Appendable"
import MeshAppendable from "../core/MeshAppendable"
import SimpleObjectManager from "../core/SimpleObjectManager"

export default (
    target: Appendable | undefined
): Record<string, number> | undefined => {
    if (!(target instanceof MeshAppendable)) return
    const [mode] = transformControlsModePtr
    if (mode === "scale" && target instanceof SimpleObjectManager)
        return {
            scaleX: target.scaleX,
            scaleY: target.scaleY,
            scaleZ: target.scaleZ
        }
    else if (mode === "rotate")
        return {
            rotationX: target.rotationX,
            rotationY: target.rotationY,
            rotationZ: target.rotationZ
        }
    else if (mode === "translate")
        return {
            x: target.x,
            y: target.y,
            z: target.z
        }
}
