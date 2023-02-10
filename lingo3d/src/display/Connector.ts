import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { getMeshAppendables } from "../api/core/MeshAppendable"
import PhysicsObjectManager from "./core/PhysicsObjectManager"

export default class Connector extends Appendable {
    public constructor() {
        super()

        this.createEffect(() => {
            const { _to, _from } = this

            // const [toManager] = getMeshAppendables(_to)
            // const [fromManager] = getMeshAppendables(_from)
            // if (
            //     !(toManager instanceof PhysicsObjectManager) ||
            //     !(fromManager instanceof PhysicsObjectManager)
            // )
            //     return
        }, [this.refreshState.get])
    }

    protected refreshState = new Reactive({})

    private _to?: string | Appendable
    public get to() {
        return this._to
    }
    public set to(val) {
        this._to = val
        this.refreshState.set({})
    }

    private _from?: string | Appendable
    public get from() {
        return this._from
    }
    public set from(val) {
        this._from = val
        this.refreshState.set({})
    }

    private _fromProp?: string
    public get fromProp() {
        return this._fromProp
    }
    public set fromProp(val) {
        this._fromProp = val
        this.refreshState.set({})
    }

    private _toProp?: string
    public get toProp() {
        return this._toProp
    }
    public set toProp(val) {
        this._toProp = val
        this.refreshState.set({})
    }
}
