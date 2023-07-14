import { Object3D } from "three"
import { matrix4 } from "./reusables"

export default (parent: Object3D, object: Object3D) => {
    matrix4.copy(parent.matrixWorld).invert()
    object.parent && matrix4.multiply(object.parent.matrixWorld)
    object.applyMatrix4(matrix4)
    object.parent = parent
}
