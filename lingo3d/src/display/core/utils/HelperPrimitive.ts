import { BufferGeometry } from "three"
import MeshAppendable from "../MeshAppendable"
import Primitive from "../Primitive"
import { excludeSSRSet } from "../../../collections/excludeSSRSet"
import { selectionRedirectMap } from "../../../collections/selectionRedirectMap"

export default abstract class HelperPrimitive extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        owner: MeshAppendable | undefined
    ) {
        super(geometry)
        excludeSSRSet.add(this.outerObject3d)
        this.$ghost(false)
        this.opacity = 0.5

        if (!owner) return
        selectionRedirectMap.set(this, owner)
        owner.append(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        excludeSSRSet.delete(this.outerObject3d)
    }
}
