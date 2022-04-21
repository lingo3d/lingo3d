import { applyMixins } from "@lincode/utils"
import { Mesh, MeshStandardMaterial, Object3D } from "three"
import SimpleObjectManager from "./SimpleObjectManager"
import IFound from "../../interface/IFound"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"

class FoundManager extends SimpleObjectManager<Mesh> implements IFound {
    protected material: MeshStandardMaterial

    public constructor(mesh: Object3D) {
        // mesh.castShadow = true
        // mesh.receiveShadow = true
        //@ts-ignore
        super(mesh)
        //@ts-ignore
        this.material = mesh.material ??= new MeshStandardMaterial()
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }
}
interface FoundManager extends SimpleObjectManager<Mesh>, TexturedBasicMixin, TexturedStandardMixin {}
applyMixins(FoundManager, [TexturedBasicMixin, TexturedStandardMixin])
export default FoundManager