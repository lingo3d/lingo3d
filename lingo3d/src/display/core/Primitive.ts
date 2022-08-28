import { applyMixins } from "@lincode/utils"
import { Mesh, BufferGeometry } from "three"
import ObjectManager from "./ObjectManager"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import IPrimitive, {
    primitiveDefaults,
    primitiveSchema
} from "../../interface/IPrimitive"
import { standardMaterial } from "../utils/reusables"

abstract class Primitive extends ObjectManager<Mesh> implements IPrimitive {
    public static defaults = primitiveDefaults
    public static schema = primitiveSchema

    protected material = standardMaterial

    public constructor(geometry: BufferGeometry) {
        const mesh = new Mesh(geometry, standardMaterial)
        mesh.castShadow = true
        mesh.receiveShadow = true
        super(mesh)
    }
}
interface Primitive
    extends ObjectManager<Mesh>,
        TexturedBasicMixin,
        TexturedStandardMixin {}
applyMixins(Primitive, [TexturedBasicMixin, TexturedStandardMixin])
export default Primitive
