import { Object3D } from "three/src/Three"
import MeshItem from "../core/MeshItem"
import getWorldPosition from "./getWorldPosition"
import { halfPi } from "./reusables"

const dirObj = new Object3D()

export default (target: MeshItem) => {
    const dir = getWorldPosition(target.outerObject3d).normalize()
    dirObj.lookAt(dir)
    dirObj.rotateX(halfPi)
    return target.outerObject3d.quaternion.copy(dirObj.quaternion)
}
