import { Object3D, Vector3 } from "three"

export default (from: Object3D, to: Object3D, vec: Vector3) =>
    to.worldToLocal(from.localToWorld(vec))
