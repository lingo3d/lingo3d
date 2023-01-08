import { Cancellable } from "@lincode/promiselikes"
import { filter, filterBoolean } from "@lincode/utils"
import { DoubleSide, Mesh, MeshStandardMaterial } from "three"
import debounceSystem from "../../../utils/debounceSystem"
import createReferenceCounter, {
    classMapsMap
} from "../utils/createReferenceCounter"

//color, opacity
type Params = [string | undefined, number | undefined]

const [increaseCount, decreaseCount] = createReferenceCounter<
    MeshStandardMaterial,
    Params
>(
    (_, params) =>
        new MeshStandardMaterial(
            filter(
                {
                    side: DoubleSide,
                    color: params[0],
                    opacity: params[1]
                },
                filterBoolean
            )
        )
)

export const refreshParamsSystem = debounceSystem(
    (target: TexturedStandardMixin) => {
        if (target.materialParamsOld)
            decreaseCount(MeshStandardMaterial, target.materialParamsOld)
        else
            target.then(() =>
                decreaseCount(MeshStandardMaterial, target.materialParams)
            )
        target.object3d.material = increaseCount(
            MeshStandardMaterial,
            target.materialParams
        )
        target.materialParamsOld = [...target.materialParams]
    }
)

setInterval(() => {
    console.log(classMapsMap.get(MeshStandardMaterial)![0])
}, 1000)

export default abstract class TexturedStandardMixin {
    public declare object3d: Mesh
    public declare then: (cb: (val: any) => void) => Cancellable

    public get material() {
        return this.object3d.material as MeshStandardMaterial
    }

    private _materialParams?: Params
    public get materialParams(): Params {
        return (this._materialParams ??= new Array(2) as Params)
    }
    public materialParamsOld?: Params

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.materialParams[0] = val
        refreshParamsSystem(this)
    }

    public get opacity() {
        return this.material.opacity
    }
    public set opacity(val) {
        this.materialParams[1] = val
        refreshParamsSystem(this)
    }
}
