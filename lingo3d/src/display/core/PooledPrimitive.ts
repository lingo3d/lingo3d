import { BufferGeometry } from "three"
import Primitive from "./Primitive"
import {
    CircleParams,
    releaseCircleGeometry,
    requestCircleGeometry
} from "../../pools/circleGeometryPool"
import {
    ConeParams,
    releaseConeGeometry,
    requestConeGeometry
} from "../../pools/coneGeometryPool"
import {
    CylinderParams,
    releaseCylinderGeometry,
    requestCylinderGeometry
} from "../../pools/cylinderGeometryPool"
import {
    TorusParams,
    releaseTorusGeometry,
    requestTorusGeometry
} from "../../pools/torusGeometryPool"

export default abstract class PooledPrimitve extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        public $releaseGeometry:
            | typeof releaseCircleGeometry
            | typeof releaseConeGeometry
            | typeof releaseCylinderGeometry
            | typeof releaseTorusGeometry,
        public $requestGeometry:
            | typeof requestCircleGeometry
            | typeof requestConeGeometry
            | typeof requestCylinderGeometry
            | typeof requestTorusGeometry
    ) {
        super(geometry)
    }

    public abstract $getParams():
        | CircleParams
        | ConeParams
        | CylinderParams
        | TorusParams
}
