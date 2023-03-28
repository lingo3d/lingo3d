import { BufferGeometry } from "three"
import renderSystemAutoClear from "../../utils/renderSystemAutoClear"
import Primitive from "./Primitive"

export const [
    addRefreshPooledPrimitiveSystem,
    deleteRefreshPooledPrimitiveSystem
] = renderSystemAutoClear((target: PooledPrimitve) => {
    target.decreaseGeometry(target.paramString)
    const params = target.getParams()
    target.object3d.geometry = target.increaseGeometry(
        params,
        (target.paramString = JSON.stringify(params))
    )
})

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
