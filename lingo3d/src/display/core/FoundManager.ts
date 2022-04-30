import { applyMixins } from "@lincode/utils"
import { Mesh, MeshStandardMaterial, Object3D } from "three"
import SimpleObjectManager from "./SimpleObjectManager"
import IFound, { foundDefaults, foundSchema } from "../../interface/IFound"
import TexturedBasicMixin from "./mixins/TexturedBasicMixin"
import TexturedStandardMixin from "./mixins/TexturedStandardMixin"
import ObjectManager from "./ObjectManager"
import scene from "../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import AnimationManager from "./SimpleObjectManager/AnimationManager"
import { emitSceneChange } from "../../events/onSceneChange"

class FoundManager extends SimpleObjectManager<Mesh> implements IFound {
    public static componentName = "found"
    public static defaults = foundDefaults
    public static schema = foundSchema

    protected material: MeshStandardMaterial

    public constructor(mesh: Object3D) {
        // mesh.castShadow = true
        // mesh.receiveShadow = true
        //@ts-ignore
        super(mesh)
        //@ts-ignore
        this.material = mesh.material ??= new MeshStandardMaterial()

        const { modelManager } = this.outerObject3d.userData

        this.parent = modelManager
        ;(modelManager.children ??= new Set()).add(this)
        emitSceneChange()

        if (!modelManager?.animationManagers) return

        for (const animationManager of Object.values(modelManager.animationManagers) as Array<AnimationManager>)
            this.animations[animationManager.name] = this.watch(animationManager.retarget(mesh))
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