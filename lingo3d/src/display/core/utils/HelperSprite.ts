import { hiddenAppendables } from "../../../api/core/collections"
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
        hiddenAppendables.add(this)
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
