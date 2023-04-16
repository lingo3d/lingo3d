import { BufferGeometry } from "three"
import MeshAppendable from "../../../api/core/MeshAppendable"
import Primitive from "../Primitive"

export default abstract class HelperPrimitive extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        owner: MeshAppendable | undefined
    ) {
        super(geometry)
        this.disableSceneGraph = true
        this.disableSerialize = true
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false

        if (!owner) return

        this.userData.selectionPointer = owner
        owner.append(this)
    }
}
