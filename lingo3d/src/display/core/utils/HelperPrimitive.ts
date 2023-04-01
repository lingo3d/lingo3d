import { BufferGeometry } from "three"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import Primitive from "../Primitive"
import { eraseAppendable } from "../../utils/eraseAppendable"

//@ts-ignore
export default abstract class HelperPrimitive extends Primitive {
    public static componentName = "helper"
    public static override defaults = positionedDefaults
    public static override schema = positionedSchema

    public target?: MeshAppendable

    public constructor(geometry: BufferGeometry) {
        super(geometry)
        eraseAppendable(this)
        this.opacity = 0.5
        this.castShadow = false
        this.receiveShadow = false
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
        if (this.target) this.target.userData.onTransformControls = cb
    }
}
