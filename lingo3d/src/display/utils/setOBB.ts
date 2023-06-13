import { Object3D } from "three"
import { OBB } from "three/examples/jsm/math/OBB"
import getWorldPosition from "../../memo/getWorldPosition"

export default (object3d: Object3D, obb: OBB) => {
    obb.center.copy(getWorldPosition(object3d))
    obb.applyMatrix4(object3d.matrixWorld)
}
