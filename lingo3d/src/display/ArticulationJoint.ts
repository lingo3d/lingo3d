import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshManager from "./core/MeshManager"
import { getMeshManagerSets } from "./core/StaticObjectManager"

export default class ArticulationJoint extends Appendable {
    public constructor() {
        super()

        this.createEffect(() => {
            const from = this.fromState.get()
            const to = this.toState.get()
            if (!from || !to) return

            const [[fromManager]] = getMeshManagerSets(from)
            const [[toManager]] = getMeshManagerSets(from)
        }, [this.fromState.get, this.toState.get])
    }

    private fromState = new Reactive<string | MeshManager | undefined>(
        undefined
    )
    public get from() {
        return this.fromState.get()
    }
    public set from(val) {
        this.fromState.set(val)
    }

    private toState = new Reactive<string | MeshManager | undefined>(undefined)
    public get to() {
        return this.toState.get()
    }
    public set to(val) {
        this.toState.set(val)
    }
}
