import { hiddenAppendables } from "../../../api/core/collections"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { EDITOR_URL } from "../../../globals"
import Sprite from "../../Sprite"

export default class HelperSprite extends Sprite {
    public target: MeshAppendable | undefined

    public constructor(type: "camera" | "target" | "light" | "audio") {
        super()
        this.texture = `${EDITOR_URL}${type}Sprite.png`
        this.scale = 0.5
        this.castShadow = false
        this.receiveShadow = false
        hiddenAppendables.add(this)
    }
}
