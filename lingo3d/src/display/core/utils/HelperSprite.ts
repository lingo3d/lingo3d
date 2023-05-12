import { EDITOR_URL } from "../../../api/assetsPath"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { selectionRedirectMap } from "../../../collections/selectionRedirectMap"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"
import Sprite from "../../Sprite"

export default class HelperSprite extends Sprite {
    public constructor(
        type: "camera" | "light" | "audio",
        owner: MeshAppendable
    ) {
        super()
        ssrExcludeSet.add(this.outerObject3d)
        this.$ghost(false)
        this.texture = `${EDITOR_URL()}${type}Sprite.png`
        this.scale = 0.5

        selectionRedirectMap.set(this, owner)
        owner.append(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.outerObject3d)
    }
}
