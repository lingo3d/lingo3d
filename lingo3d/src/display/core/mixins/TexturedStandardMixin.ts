import { filter, filterBoolean } from "@lincode/utils"
import { DoubleSide, Mesh, MeshStandardMaterial } from "three"
import debounceSystem from "../../../utils/debounceSystem"
import createReferenceCounter from "../utils/createReferenceCounter"

//color, opacity
type Params = [string | undefined, number | undefined]

const [increaseCount, decreaseCount, allocateDefaultInstance] =
    createReferenceCounter<MeshStandardMaterial, Params>(
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
        target.materialParamsOld &&
            decreaseCount(MeshStandardMaterial, target.materialParamsOld)
        target.object3d.material = increaseCount(
            MeshStandardMaterial,
            target.materialParams
        )
        target.materialParamsOld = [...target.materialParams]
    }
)

allocateDefaultInstance(MeshStandardMaterial, [undefined, undefined])

export default abstract class TexturedStandardMixin {
    public declare object3d: Mesh

    private _materialParams?: Params
    public get materialParams(): Params {
        return (this._materialParams ??= new Array(2) as Params)
    }
    public materialParamsOld?: Params

    public get color() {
        return this.materialParams[0]
    }
    public set color(val) {
        this.materialParams[0] = val
        refreshParamsSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val) {
        this.materialParams[1] = val
        refreshParamsSystem(this)
    }
}
