import { BufferGeometry } from "three"
import MeshAppendable from "../../../api/core/MeshAppendable"
import Primitive from "../Primitive"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"

export default abstract class HelperPrimitive extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        owner: MeshAppendable | undefined
    ) {
        super(geometry)
        ssrExcludeSet.add(this.outerObject3d)
        this.object3d.castShadow = this.object3d.receiveShadow = false
        this.disableSceneGraph = true
        this.disableSerialize = true
        this.opacity = 0.5

        if (!owner) return

        this.userData.selectionPointer = owner
        owner.append(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.outerObject3d)
    }
}
