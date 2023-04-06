import { EDITOR_URL } from "../../../api/assetsPath"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import Sprite from "../../Sprite"

export default class HelperSprite extends Sprite {
    public target?: MeshAppendable

    public constructor(type: "camera" | "light" | "audio") {
        super()
        this.disableBehavior(true, true, false)
        this.texture = `${EDITOR_URL()}${type}Sprite.png`
        this.scale = 0.5
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
