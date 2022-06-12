import { Disposable } from "@lincode/promiselikes"
import { Object3D } from "three"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"

export const appendableRoot = new Set<Appendable>()
export const hiddenAppendables = new WeakSet<Appendable>()

export default class Appendable extends Disposable {
    public constructor(
        public outerObject3d: Object3D
    ) {
        super()
        outerObject3d.userData.manager = this

        appendableRoot.add(this)
        emitSceneGraphChange()
    }

    public get uuid() {
        return this.outerObject3d.uuid
    }

    public parent?: Appendable
    public children?: Set<Appendable>

    protected _append(child: Appendable) {
        appendableRoot.delete(child)
        emitSceneGraphChange()

        child.parent?.children?.delete(child)
        child.parent = this

        ;(this.children ??= new Set()).add(child)
    }

    public append(child: Appendable) {
        this._append(child)
        this.outerObject3d.add(child.outerObject3d)
    }
    
    public attach(child: Appendable) {
        this._append(child)
        this.outerObject3d.attach(child.outerObject3d)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()

        appendableRoot.delete(this)
        emitSceneGraphChange()

        this.parent?.children?.delete(this)
        this.parent = undefined

        this.outerObject3d.parent?.remove(this.outerObject3d)

        if (this.children)
            for (const child of this.children)
                child.dispose()

        return this
    }
}