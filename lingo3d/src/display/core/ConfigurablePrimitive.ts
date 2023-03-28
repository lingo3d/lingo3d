import { BufferGeometry } from "three"
import renderSystemAutoClear from "../../utils/renderSystemAutoClear"
import Primitive from "./Primitive"
import createInstancePool from "./utils/createInstancePool"

const [increaseCount, decreaseCount, allocateDefaultInstance] =
    createInstancePool<BufferGeometry>(
        (ClassVal, params) => new ClassVal(...params),
        (geometry) => geometry.dispose()
    )
export { allocateDefaultInstance }

export const [addRefreshParamsSystem] = renderSystemAutoClear(
    (target: ConfigurablePrimitive<any>) => {
        const { Geometry } = target
        decreaseCount(Geometry, target.params)
        target.object3d.geometry = increaseCount(
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
        decreaseCount(this.Geometry, this.params)
    }
}
