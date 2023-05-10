import { BufferGeometry } from "three"
import Primitive from "./Primitive"
import {
    CircleParams,
    requestCircleGeometry
} from "../../pools/circleGeometryPool"
import { ConeParams, requestConeGeometry } from "../../pools/coneGeometryPool"
import {
    CylinderParams,
    requestCylinderGeometry
} from "../../pools/cylinderGeometryPool"
import {
    TorusParams,
    requestTorusGeometry
} from "../../pools/torusGeometryPool"

export default abstract class PooledPrimitve extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        public $paramString: string,
        public $decreaseGeometry: (paramString: string) => void,
        public $increaseGeometry:
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

    protected override disposeNode() {
        super.disposeNode()
        this.$decreaseGeometry(this.$paramString)
    }
}
