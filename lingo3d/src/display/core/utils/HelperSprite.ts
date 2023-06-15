import MeshAppendable from "../MeshAppendable"
import { selectionRedirectMap } from "../../../collections/selectionRedirectMap"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"
import Sprite from "../../Sprite"
import { editorUrlPtr } from "../../../pointers/assetsPathPointers"
import { ssaoExcludeSet } from "../../../collections/ssaoExcludeSet"

export default class HelperSprite extends Sprite {
    public constructor(
        type: "camera" | "light" | "audio",
        owner: MeshAppendable
    ) {
        super()
        ssrExcludeSet.add(this.outerObject3d)
        ssaoExcludeSet.add(this.outerObject3d)
        this.$ghost(false)
        this.texture = `${editorUrlPtr[0]}${type}Sprite.png`
        this.scale = 0.5

        selectionRedirectMap.set(this, owner)
        owner.append(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.outerObject3d)
        ssaoExcludeSet.delete(this.outerObject3d)
    }
}
