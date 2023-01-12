import { BufferGeometry } from "three"
import callPrivateMethod from "../../utils/callPrivateMethod"
import debounceSystem from "../../utils/debounceSystem"
import getPrivateValue from "../../utils/getPrivateValue"
import unsafeSetValue from "../../utils/unsafeSetValue"
import Primitive from "./Primitive"
import createInstancePool from "./utils/createInstancePool"

const [increaseCount, decreaseCount, allocateDefaultInstance] =
    createInstancePool<BufferGeometry>(
        (ClassVal, params) => new ClassVal(...params)
    )
export { allocateDefaultInstance }

export const refreshParamsSystem = debounceSystem(
    <GeometryClass extends typeof BufferGeometry>(
        target: ConfigurablePrimitive<GeometryClass>
    ) => {
        const Geometry = getPrivateValue(target, "Geometry")
        decreaseCount(Geometry, getPrivateValue(target, "params"))
        target.object3d.geometry = increaseCount(
            Geometry,
            unsafeSetValue(
                target,
                "params",
                callPrivateMethod(target, "getParams")
            )
        )
    }
)

export default abstract class ConfigurablePrimitive<
    GeometryClass extends typeof BufferGeometry
> extends Primitive {
    public constructor(
        private Geometry: GeometryClass,
        private params: Readonly<ConstructorParameters<GeometryClass>>,
        geometry: InstanceType<GeometryClass>
    ) {
        super(geometry)
    }

    protected abstract getParams(): Readonly<
        ConstructorParameters<GeometryClass>
    >

    protected override _dispose() {
        super._dispose()
        decreaseCount(this.Geometry, this.params)
    }
}
