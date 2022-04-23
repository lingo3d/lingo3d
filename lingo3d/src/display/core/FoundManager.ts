import { applyMixins } from "@lincode/utils"
import { Mesh, MeshStandardMaterial, Object3D } from "three"
import SimpleObjectManager from "./SimpleObjectManager"
import IFound from "../../interface/IFound"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import ObjectManager from "./ObjectManager"
import scene from "../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"

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

    private managerSet?: boolean
    protected override addToRaycastSet(set: Set<Object3D>, handle: Cancellable) {
        if (!this.managerSet) {
            this.managerSet = true
            this.object3d.traverse(child => child.userData.manager = this)
        }
        set.add(this.object3d)
        handle.then(() => set.delete(this.object3d))
    }
}
interface FoundManager extends SimpleObjectManager<Mesh>, TexturedBasicMixin, TexturedStandardMixin {}
applyMixins(FoundManager, [TexturedBasicMixin, TexturedStandardMixin])
export default FoundManager