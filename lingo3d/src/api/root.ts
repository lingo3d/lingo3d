import { appendableRoot } from "../collections/appendableRoot"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import scene from "../engine/scene"

class Root extends Appendable {
    public constructor() {
        super()
        this.$ghost()
        this.$disableUnload = true
    }

    public override children = appendableRoot

    public declare traverse: (
        cb: (appendable: Appendable | MeshAppendable) => void
    ) => void

    public declare traverseSome: (
        cb: (appendable: Appendable | MeshAppendable) => unknown
    ) => boolean

    public override append(child: Appendable | MeshAppendable) {
        this.$appendNode(child)
        "object3d" in child && scene.add(child.outerObject3d)
    }

    public override attach(child: Appendable | MeshAppendable) {
        this.$appendNode(child)
        "object3d" in child && scene.attach(child.outerObject3d)
    }

    protected override disposeNode() {
        throw new Error("root cannot be disposed")
    }
}

export default new Root()
