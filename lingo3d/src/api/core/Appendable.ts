import { Disposable } from "@lincode/promiselikes"
import { Object3D } from "three"
import { emitDispose } from "../../events/onDispose"
import { emitSceneGraphChange } from "../../events/onSceneGraphChange"

export const appendableRoot = new Set<Appendable>()
export const hiddenAppendables = new WeakSet<Appendable>()
export const nonSerializedAppendables = new WeakSet<Appendable>()

export default class Appendable<
    T extends Object3D = Object3D
> extends Disposable {
    public nativeObject3d: Object3D

    public constructor(public outerObject3d: T = new Object3D() as T) {
        super()
        outerObject3d.userData.manager = this
        this.nativeObject3d = outerObject3d

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

    public traverse(cb: (appendable: Appendable) => void) {
        for (const child of this.children ?? []) {
            cb(child)
            child.traverse(cb)
        }
    }

    public traverseSome(cb: (appendable: Appendable) => unknown) {
        for (const child of this.children ?? []) {
            if (cb(child)) return true
            child.traverseSome(cb)
        }
        return false
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
        this.parent?.children?.delete(this)
        this.parent = undefined

        emitSceneGraphChange()
        emitDispose(this)

        this.outerObject3d.parent?.remove(this.outerObject3d)

        if (this.children) for (const child of this.children) child.dispose()

        return this
    }
}
