import { Object3D } from "three/src/Three"
import Appendable from "../../api/core/Appendable"
import getWorldPosition from "./getWorldPosition"
import { halfPi } from "./reusables"

const dirObj = new Object3D()

export default (target: Appendable) => {
    const dir = getWorldPosition(target.outerObject3d).normalize()
    dirObj.lookAt(dir)
    dirObj.rotateX(halfPi)
    return target.outerObject3d.quaternion.copy(dirObj.quaternion)
}
