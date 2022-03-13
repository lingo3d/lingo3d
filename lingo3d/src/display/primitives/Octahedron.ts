import { OctahedronBufferGeometry } from "three"
import { radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

const geometry = new OctahedronBufferGeometry(radiusScaled)

export default class Octahedron extends Primitive {
    public constructor() {
        super(geometry)
    }
}