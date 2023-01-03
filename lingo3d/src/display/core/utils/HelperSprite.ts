import { hiddenAppendables } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { TransformControlsPhase } from "../../../events/onTransformControls"
import { EDITOR_URL } from "../../../globals"
import Sprite from "../../Sprite"

export default class HelperSprite extends Sprite {
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
