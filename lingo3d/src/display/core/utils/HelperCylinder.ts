import MeshAppendable from "../MeshAppendable"
import { cylinderGeometry } from "../../primitives/Cylinder"
import HelperPrimitive from "./HelperPrimitive"

export default class HelperCylinder extends HelperPrimitive {
    public constructor(owner: MeshAppendable) {
        super(cylinderGeometry, owner)
    }
}
