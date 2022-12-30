import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import MeshItem from "./core/MeshItem"
import { getMeshItemSets } from "./core/StaticObjectManager"

export default class ArticulationJoint extends Appendable {
    public constructor() {
        super()

        this.createEffect(() => {
            const from = this.fromState.get()
            const to = this.toState.get()
            if (!from || !to) return

            const [[fromManager]] = getMeshItemSets(from)
            const [[toManager]] = getMeshItemSets(from)

        }, [this.fromState.get, this.toState.get])
    }

    private fromState = new Reactive<string | MeshItem | undefined>(undefined)
    public get from() {
        return this.fromState.get()
    }
    public set from(val) {
        this.fromState.set(val)
    }

    private toState = new Reactive<string | MeshItem | undefined>(undefined)
    public get to() {
        return this.toState.get()
    }
    public set to(val) {
        this.toState.set(val)
    }
}
