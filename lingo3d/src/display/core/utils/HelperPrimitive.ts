import { BufferGeometry } from "three"
import { hiddenAppendables } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { TransformControlsPhase } from "../../../events/onTransformControls"
import Primitive from "../Primitive"

export default abstract class HelperPrimitive extends Primitive {
    public target?: MeshAppendable

    public constructor(geometry: BufferGeometry) {
        super(geometry)
        hiddenAppendables.add(this)
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false
    }

    public override get onTranslateControl() {
        return this.outerObject3d.userData.onTranslateControl
    }
    public override set onTranslateControl(
        cb: (phase: TransformControlsPhase) => void
    ) {
        super.onTranslateControl = cb
        if (this.target)
            this.target.outerObject3d.userData.onTranslateControl = cb
    }
}
