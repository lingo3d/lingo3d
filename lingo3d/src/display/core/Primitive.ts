import { applyMixins } from "@lincode/utils"
import { Mesh, MeshStandardMaterial, BufferGeometry } from "three"
import ObjectManager from "./ObjectManager"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import IPrimitive from "../../interface/IPrimitive"

abstract class Primitive extends ObjectManager<Mesh> implements IPrimitive {
    protected material: MeshStandardMaterial
    protected transparent?: boolean

    public constructor(geometry: BufferGeometry, transparent?: boolean) {
        const material = new MeshStandardMaterial(transparent ? { transparent: true } : undefined)
        const mesh = new Mesh(geometry, material)
        // mesh.castShadow = true
        // mesh.receiveShadow = true
        super(mesh)
        this.material = material
        this.transparent = transparent
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }
}
interface Primitive extends ObjectManager<Mesh>, TexturedBasicMixin, TexturedStandardMixin {}
applyMixins(Primitive, [TexturedBasicMixin, TexturedStandardMixin])
export default Primitive