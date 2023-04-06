import { BufferGeometry } from "three"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import Primitive from "../Primitive"

export default abstract class HelperPrimitive extends Primitive {
    public constructor(
        geometry: BufferGeometry,
        private owner: MeshAppendable | undefined
    ) {
        super(geometry)
        this.disableBehavior(true, true, false)
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false

        if (!owner) return

        this.userData.selectionPointer = owner
        owner.append(this)
    }

    public override get onTransformControls() {
        return this.userData.onTransformControls
    }
    public override set onTransformControls(
        cb:
            | ((
                  phase: TransformControlsPhase,
                  mode: TransformControlsMode
              ) => void)
            | undefined
    ) {
        super.onTransformControls = cb
        if (this.owner) this.owner.userData.onTransformControls = cb
    }
}
