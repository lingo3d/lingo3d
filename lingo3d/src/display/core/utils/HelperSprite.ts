import { EDITOR_URL } from "../../../api/assetsPath"
import MeshAppendable from "../../../api/core/MeshAppendable"
import Sprite from "../../Sprite"

export default class HelperSprite extends Sprite {
    public constructor(
        type: "camera" | "light" | "audio",
        owner: MeshAppendable
    ) {
        super()
        this.disableBehavior(true, true, false)
        this.texture = `${EDITOR_URL()}${type}Sprite.png`
        this.scale = 0.5
        this.castShadow = false
        this.receiveShadow = false

        this.userData.selectionPointer = owner
        owner.append(this)
    }
}
