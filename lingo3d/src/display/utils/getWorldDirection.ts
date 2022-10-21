import { Object3D, Vector3 } from "three"

export default (target: Object3D) => target.getWorldDirection(new Vector3())
