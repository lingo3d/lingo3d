import { Disposable } from "@lincode/promiselikes"
import { Object3D } from "three"

export const appendableRoot = new Set<Appendable>()

export default class Appendable extends Disposable {
    public constructor(
        public outerObject3d: Object3D
    ) {
        super()
        outerObject3d.userData.manager = this
        appendableRoot.add(this)
    }

    public parent?: Appendable
    public children?: Set<Appendable>

    public append(child: Appendable) {
        this.outerObject3d.add(child.outerObject3d)

        appendableRoot.delete(child)
        child.parent?.children?.delete(child)
        child.parent = this

        ;(this.children ??= new Set()).add(child)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()

        appendableRoot.delete(this)
        this.parent?.children?.delete(this)
        this.parent = undefined

        this.outerObject3d.parent?.remove(this.outerObject3d)

        for (const child of [...this.outerObject3d.children])
            child.userData.manager?.dispose()

        return this
    }
}