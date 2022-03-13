import { ConeBufferGeometry } from "three"
import { diameterScaled, radiusScaled } from "../../engine/constants"
import Primitive from "../core/Primitive"

const geometry = new ConeBufferGeometry(radiusScaled, diameterScaled, 16)

export default class Cone extends Primitive {
    public constructor() {
        super(geometry)
    }
}