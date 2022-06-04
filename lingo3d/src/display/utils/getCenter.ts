import { Bone, Object3D } from "three"
import { box3, vector3 } from "./reusables"

export default (object: Object3D) => {
    if (object instanceof Bone)
        return object.getWorldPosition(vector3)

    return box3.setFromObject(object).getCenter(vector3)
}