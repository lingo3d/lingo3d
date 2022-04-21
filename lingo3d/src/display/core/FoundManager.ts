import { applyMixins } from "@lincode/utils"
import { Mesh, MeshStandardMaterial, Object3D } from "three"
import SimpleObjectManager from "./SimpleObjectManager"
import IFound from "../../interface/IFound"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import ObjectManager from "./ObjectManager"
import scene from "../../engine/scene"

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

    public override append(target: ObjectManager) {
        setTimeout(() => {
            scene.add(target.outerObject3d)
            target.placeAt(this)
            this.then(() => target.dispose())
        })
    }
}
interface FoundManager extends SimpleObjectManager<Mesh>, TexturedBasicMixin, TexturedStandardMixin {}
applyMixins(FoundManager, [TexturedBasicMixin, TexturedStandardMixin])
export default FoundManager