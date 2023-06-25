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
import MixinType from "./mixins/utils/MixinType"
import PhysicsObjectManager from "./PhysicsObjectManager"

abstract class Primitive
    extends PhysicsObjectManager<StandardMesh>
    implements IPrimitive
{
    public static defaults = primitiveDefaults
    public static schema = primitiveSchema

    public constructor(geometry: BufferGeometry) {
        const mesh = new Mesh(geometry, standardMaterial)
        super(mesh)
        mesh.receiveShadow = true
    }
}
interface Primitive
    extends PhysicsObjectManager<StandardMesh>,
        MixinType<TexturedStandardMixin> {}
applyMixins(Primitive, [TexturedStandardMixin])
export default Primitive
