import { Object3D, Quaternion, Vector3 } from "three"
import { setManager } from "../utils/manager"
import Appendable from "./Appendable"

export default class MeshAppendable<
    T extends Object3D = Object3D
> extends Appendable {
    public object3d: Object3D
    public position: Vector3
    public quaternion: Quaternion

    public constructor(public outerObject3d: T = new Object3D() as T) {
        super()
        setManager(outerObject3d, this)
        this.object3d = outerObject3d
        this.position = outerObject3d.position
        this.quaternion = outerObject3d.quaternion
    }

    public declare parent?: MeshAppendable
    public declare children?: Set<Appendable | MeshAppendable>

    public declare traverse: (
        cb: (appendable: Appendable | MeshAppendable) => void
    ) => void

    public declare traverseSome: (
        cb: (appendable: Appendable | MeshAppendable) => unknown
    ) => boolean

    public override append(child: Appendable | MeshAppendable) {
        this._append(child)
        "outerObject3d" in child && this.outerObject3d.add(child.outerObject3d)
    }

    public attach(child: Appendable | MeshAppendable) {
        this._append(child)
        "outerObject3d" in child &&
            this.outerObject3d.attach(child.outerObject3d)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.outerObject3d.parent?.remove(this.outerObject3d)
        return this
    }
}
