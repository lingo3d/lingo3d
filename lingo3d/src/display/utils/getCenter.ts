import { Object3D } from "three"
import { box3, vector3 } from "./reusables"

export default (object: Object3D) => box3.setFromObject(object).getCenter(vector3)