import { Object3D } from "three"
import { matrix4 } from "./reusables"

const updateWorldMatrix = (target: Object3D) => {
    target.parent &&
        target.matrixWorld.multiplyMatrices(
            target.parent.matrixWorld,
            target.matrix
        )
}

export default (parent: Object3D, object: Object3D, updateMatrix?: boolean) => {
    matrix4.copy(parent.matrixWorld).invert()
    object.parent && matrix4.multiply(object.parent.matrixWorld)
    object.applyMatrix4(matrix4)
    object.parent = parent
    updateMatrix && object.traverse(updateWorldMatrix)
}
