import { BufferGeometry } from "three"
import MeshAppendable from "../MeshAppendable"
import Primitive from "../Primitive"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"
import { selectionRedirectMap } from "../../../collections/selectionRedirectMap"

export default abstract class HelperPrimitive extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        owner: MeshAppendable | undefined
    ) {
        super(geometry)
        ssrExcludeSet.add(this.outerObject3d)
        this.$ghost(false)
        this.opacity = 0.5

        if (!owner) return
        selectionRedirectMap.set(this, owner)
        owner.append(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.outerObject3d)
    }
}
