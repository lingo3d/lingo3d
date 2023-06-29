import { BufferGeometry } from "three"
import Primitive from "./Primitive"
import {
    CircleParams,
    circleGeometryPool
} from "../../pools/circleGeometryPool"
import { ConeParams, coneGeometryPool } from "../../pools/coneGeometryPool"
import {
    CylinderParams,
    cylinderGeometryPool
} from "../../pools/cylinderGeometryPool"
import { TorusParams, torusGeometryPool } from "../../pools/torusGeometryPool"

export default abstract class PooledPrimitve extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        public $geometryPool:
            | typeof circleGeometryPool
            | typeof coneGeometryPool
            | typeof cylinderGeometryPool
            | typeof torusGeometryPool
    ) {
        super(geometry)
    }

    public abstract $getParams():
        | CircleParams
        | ConeParams
        | CylinderParams
        | TorusParams
}
