import { applyMixins } from "@lincode/utils"
import { Mesh, BufferGeometry } from "three"
import TexturedStandardMixin, {
    StandardMesh
} from "./mixins/TexturedStandardMixin"
import IPrimitive, {
    primitiveDefaults,
    primitiveSchema
} from "../../interface/IPrimitive"
import { standardMaterial } from "../utils/reusables"
import VisibleObjectManager from "./VisibleObjectManager"

abstract class Primitive
    extends VisibleObjectManager<StandardMesh>
    implements IPrimitive
{
    public static defaults = primitiveDefaults
    public static schema = primitiveSchema

    public constructor(geometry: BufferGeometry) {
        const mesh = new Mesh(geometry, standardMaterial)
        mesh.castShadow = true
        mesh.receiveShadow = true
        super(mesh)
    }
}
interface Primitive
    extends VisibleObjectManager<StandardMesh>,
        TexturedStandardMixin {}
applyMixins(Primitive, [TexturedStandardMixin])
export default Primitive
