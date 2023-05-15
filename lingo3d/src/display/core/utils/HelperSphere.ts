import MeshAppendable from "../MeshAppendable"
import { sphereGeometry } from "../../primitives/Sphere"
import HelperPrimitive from "./HelperPrimitive"

export default class HelperSphere extends HelperPrimitive {
    public constructor(owner: MeshAppendable | undefined) {
        super(sphereGeometry, owner)
    }
}
