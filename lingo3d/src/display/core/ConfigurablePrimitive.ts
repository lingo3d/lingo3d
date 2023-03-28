import { BufferGeometry } from "three"
import {
    decreaseGeometry,
    increaseGeometry
} from "../../pools/geometryPool"
import renderSystemAutoClear from "../../utils/renderSystemAutoClear"
import Primitive from "./Primitive"

export const [addRefreshParamsSystem] = renderSystemAutoClear(
    (target: ConfigurablePrimitive<any>) => {
        const { Geometry } = target
        decreaseGeometry(Geometry, target.params)
        target.object3d.geometry = increaseGeometry(
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
        decreaseGeometry(this.Geometry, this.params)
    }
}
