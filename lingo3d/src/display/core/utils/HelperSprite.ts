import { EDITOR_URL } from "../../../api/assetsPath"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { additionalSelectionCandidates } from "../../../collections/selectionCollections"
import {
    TransformControlsMode,
    TransformControlsPhase
} from "../../../events/onTransformControls"
import Sprite from "../../Sprite"

export default class HelperSprite extends Sprite {
    public constructor(
        type: "camera" | "light" | "audio",
        private owner: MeshAppendable
    ) {
        super()
        this.disableBehavior(true, true, false)
        this.texture = `${EDITOR_URL()}${type}Sprite.png`
        this.scale = 0.5
        this.castShadow = false
        this.receiveShadow = false

        this.userData.selectionPointer = owner
        owner.append(this)
        additionalSelectionCandidates.add(this.object3d)
    }

    protected override disposeNode() {
        super.disposeNode()
        additionalSelectionCandidates.delete(this.object3d)
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
        this.owner.userData.onTransformControls = cb
    }
}
