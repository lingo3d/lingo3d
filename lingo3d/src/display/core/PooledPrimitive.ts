import { BufferGeometry } from "three"
import { deleteRefreshPooledPrimitiveSystem } from "../../systems/configSystems/refreshPooledPrimitiveSystem"
import Primitive from "./Primitive"
import {
    CircleParams,
    increaseCircleGeometry
} from "../../pools/circleGeometryPool"
import { ConeParams, increaseConeGeometry } from "../../pools/coneGeometryPool"
import {
    CylinderParams,
    increaseCylinderGeometry
} from "../../pools/cylinderGeometryPool"
import {
    TorusParams,
    increaseTorusGeometry
} from "../../pools/torusGeometryPool"

export default abstract class PooledPrimitve extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        public paramString: string,
        public decreaseGeometry: (paramString: string) => void,
        public increaseGeometry:
            | typeof increaseCircleGeometry
            | typeof increaseConeGeometry
            | typeof increaseCylinderGeometry
            | typeof increaseTorusGeometry
    ) {
        super(geometry)
    }

    public abstract getParams():
        | CircleParams
        | ConeParams
        | CylinderParams
        | TorusParams

    protected override disposeNode() {
        super.disposeNode()
        this.decreaseGeometry(this.paramString)
        deleteRefreshPooledPrimitiveSystem(this)
    }
}
