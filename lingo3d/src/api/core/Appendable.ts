import { Disposable } from "@lincode/promiselikes"
import { Object3D } from "three"

export const appendableRoot = new Set<Appendable>()

export default class Appendable extends Disposable {
    public constructor(
        public outerObject3d: Object3D
    ) {
        super()
        outerObject3d.userData.manager = this
    }

    public parent?: Appendable
    public children = new Set<Appendable>()

    public append(child: Appendable) {
        this.outerObject3d.add(child.outerObject3d)

        child.parent && (child.parent.children.delete(child))
        child.parent = this

        this.children.add(child)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()

        this.parent && (this.parent.children.delete(this))
        this.parent = undefined

        this.outerObject3d.parent?.remove(this.outerObject3d)

        for (const child of [...this.outerObject3d.children])
            child.userData.manager?.dispose()

        return this
    }
}