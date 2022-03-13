import { Disposable } from "@lincode/promiselikes"
import { Object3D } from "three"

export default abstract class Appendable extends Disposable {
    public abstract outerObject3d: Object3D

    protected initOuterObject3d() {
        this.outerObject3d.userData.manager = this
    }

    public attach(object: Appendable) {
        this.outerObject3d.attach(object.outerObject3d)
    }

    public append(object: Appendable) {
        this.outerObject3d.add(object.outerObject3d)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()

        this.outerObject3d.parent?.remove(this.outerObject3d)

        for (const child of [...this.outerObject3d.children])
            child.userData.manager?.dispose()

        return this
    }
}