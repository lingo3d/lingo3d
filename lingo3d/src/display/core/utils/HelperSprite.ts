import { eraseAppendable } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { TransformControlsPhase } from "../../../events/onTransformControls"
import { EDITOR_URL } from "../../../globals"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import Sprite from "../../Sprite"

//@ts-ignore
export default class HelperSprite extends Sprite {
    public static override componentName = "helper"
    public static override defaults = positionedDefaults
    public static override schema = positionedSchema

    public target?: MeshAppendable

    public constructor(type: "camera" | "target" | "light" | "audio") {
        super()
        this.texture = `${EDITOR_URL}${type}Sprite.png`
        this.scale = 0.5
        this.castShadow = false
        this.receiveShadow = false
        eraseAppendable(this)
    }

    public override get onTranslateControl() {
        return this.userData.onTranslateControl
    }
    public override set onTranslateControl(
        cb: ((phase: TransformControlsPhase) => void) | undefined
    ) {
        super.onTranslateControl = cb
        if (this.target)
            this.target.userData.onTranslateControl = cb
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
