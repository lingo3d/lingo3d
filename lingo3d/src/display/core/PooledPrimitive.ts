import { BufferGeometry } from "three"
import { deleteRefreshPooledPrimitiveSystem } from "../../systems/refreshPooledPrimitiveSystem"
import Primitive from "./Primitive"

export default abstract class PooledPrimitve extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        public paramString: string,
        public decreaseGeometry: (paramString: string) => void,
        public increaseGeometry: (
            params: Readonly<Array<number | boolean>>,
            paramString: string
        ) => BufferGeometry
    ) {
        super(geometry)
    }

    public abstract getParams(): Readonly<Array<number | boolean>>

    protected override disposeNode() {
        super.disposeNode()
        this.decreaseGeometry(this.paramString)
        deleteRefreshPooledPrimitiveSystem(this)
    }
}
