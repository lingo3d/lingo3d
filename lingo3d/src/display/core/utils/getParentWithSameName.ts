import { Object3D } from "three"

export default (object: Object3D) => {
    if (object.parent?.name === object.name) return object.parent
    return object
}
