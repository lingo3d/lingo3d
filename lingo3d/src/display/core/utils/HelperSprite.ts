import { EDITOR_URL } from "../../../api/assetsPath"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import {
    positionedDefaults,
    positionedSchema
} from "../../../interface/IPositioned"
import Sprite from "../../Sprite"
import { eraseAppendable } from "../../utils/eraseAppendable"

//@ts-ignore
export default class HelperSprite extends Sprite {
    public static override componentName = "helper"
    public static override defaults = positionedDefaults
    public static override schema = positionedSchema

    public target?: MeshAppendable

    public constructor(type: "camera" | "light" | "audio") {
        super()
        this.texture = `${EDITOR_URL()}${type}Sprite.png`
        this.scale = 0.5
        this.castShadow = false
        this.receiveShadow = false
        eraseAppendable(this)
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
