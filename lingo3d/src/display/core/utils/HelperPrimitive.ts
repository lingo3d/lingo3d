import { BufferGeometry } from "three"
import { eraseAppendable } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { TransformControlsPhase } from "../../../events/onTransformControls"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import Primitive from "../Primitive"

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

    public override get onTranslateControl() {
        return this.userData.onTranslateControl
    }
    public override set onTranslateControl(
        cb: ((phase: TransformControlsPhase) => void) | undefined
    ) {
        super.onTranslateControl = cb
        if (this.target) this.target.userData.onTranslateControl = cb
    }

    public override get onRotateControl() {
        return this.userData.onRotateControl
    }
    public override set onRotateControl(
        cb: ((phase: TransformControlsPhase) => void) | undefined
    ) {
        super.onRotateControl = cb
        if (this.target) this.target.userData.onRotateControl = cb
    }

    public override get onScaleControl() {
        return this.userData.onScaleControl
    }
    public override set onScaleControl(
        cb: ((phase: TransformControlsPhase) => void) | undefined
    ) {
        super.onScaleControl = cb
        if (this.target) this.target.userData.onScaleControl = cb
    }
}
