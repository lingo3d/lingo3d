import { Cancellable, Disposable } from "@lincode/promiselikes"
import { createEffect, GetGlobalState } from "@lincode/reactivity"
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

    protected cancellable(cb?: () => void) {
        return this.watch(new Cancellable(cb))
    }

    protected createEffect(cb: () => (() => void) | Promise<void> | void, getStates: Array<GetGlobalState<any> | any>) {
        return this.watch(createEffect(cb, getStates))
    }
}