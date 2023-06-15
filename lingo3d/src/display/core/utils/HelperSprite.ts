import MeshAppendable from "../MeshAppendable"
import { selectionRedirectMap } from "../../../collections/selectionRedirectMap"
import { excludeSSRSet } from "../../../collections/excludeSSRSet"
import Sprite from "../../Sprite"
import { editorUrlPtr } from "../../../pointers/assetsPathPointers"

export default class HelperSprite extends Sprite {
    public constructor(
        type: "camera" | "light" | "audio",
        owner: MeshAppendable
    ) {
        super()
        excludeSSRSet.add(this.outerObject3d)
        this.$ghost(false)
        this.texture = `${editorUrlPtr[0]}${type}Sprite.png`
        this.scale = 0.5

        selectionRedirectMap.set(this, owner)
        owner.append(this)
    }

    protected override disposeNode() {
        super.disposeNode()
        excludeSSRSet.delete(this.outerObject3d)
    }
}
