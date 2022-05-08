import { Disposable } from "@lincode/promiselikes"
import { Object3D } from "three"
import { emitSceneChange } from "../../events/onSceneChange"

export const appendableRoot = new Set<Appendable>()

const traverseAppendable = (
    cb: (child: Appendable) => void,
    children: Array<Appendable> | Set<Appendable>
) => {
    for (const child of children) {
        cb(child)
        child.children && traverseAppendable(cb, child.children)
    }
}

export default class Appendable extends Disposable {
    public constructor(
        public outerObject3d: Object3D
    ) {
        super()
        outerObject3d.userData.manager = this

        appendableRoot.add(this)
        emitSceneChange()
    }

    public traverse(cb: (child: Appendable) => void) {
        this.children && traverseAppendable(cb, this.children)
    }

    public get uuid() {
        return this.outerObject3d.uuid
    }

    public parent?: Appendable
    public children?: Set<Appendable>

    protected _append(child: Appendable) {
        appendableRoot.delete(child)
        emitSceneChange()

        child.parent?.children?.delete(child)
        child.parent = this

        ;(this.children ??= new Set()).add(child)
    }

    public append(child: Appendable) {
        this._append(child)
        this.outerObject3d.add(child.outerObject3d)
    }

    public override dispose() {
        super.dispose()

        appendableRoot.delete(this)
        emitSceneChange()

        this.parent?.children?.delete(this)
        this.parent = undefined

        this.outerObject3d.parent?.remove(this.outerObject3d)

        if (this.children)
            for (const child of this.children)
                child.dispose()

        return this
    }
}