import MeshAppendable from "../MeshAppendable"
import { boxGeometry } from "../../primitives/Cube"
import HelperPrimitive from "./HelperPrimitive"

export default class HelperCube extends HelperPrimitive {
    public constructor(owner: MeshAppendable) {
        super(boxGeometry, owner)
        this.wireframe = true
        this.emissive = true
        this.opacity = 1
    }
}
