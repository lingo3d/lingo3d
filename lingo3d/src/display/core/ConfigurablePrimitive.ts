import { BufferGeometry } from "three"
import {
    decreaseGeometryCount,
    increaseGeometryCount
} from "../../pools/geometryPool"
import renderSystemAutoClear from "../../utils/renderSystemAutoClear"
import Primitive from "./Primitive"

export const [addRefreshParamsSystem] = renderSystemAutoClear(
    (target: ConfigurablePrimitive<any>) => {
        const { Geometry } = target
        decreaseGeometryCount(Geometry, target.params)
        target.object3d.geometry = increaseGeometryCount(
            Geometry,
            (target.params = target.getParams())
        )
    }
)

export default abstract class ConfigurablePrimitive<
    GeometryClass extends typeof BufferGeometry
> extends Primitive {
    public constructor(
        public Geometry: GeometryClass,
        public params: Readonly<ConstructorParameters<GeometryClass>>,
        geometry: InstanceType<GeometryClass>
    ) {
        super(geometry)
    }

    public abstract getParams(): Readonly<ConstructorParameters<GeometryClass>>

    protected override disposeNode() {
        super.disposeNode()
        decreaseGeometryCount(this.Geometry, this.params)
    }
}
