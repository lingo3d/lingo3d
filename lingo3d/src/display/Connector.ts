import { Reactive } from "@lincode/reactivity"
import Appendable, { getAppendables } from "../api/core/Appendable"

export default class Connector extends Appendable {
    public constructor() {
        super()

        this.createEffect(() => {
            const { _to, _from } = this
            if (!_from || !_to) return

            const [toManager] = getAppendables(_to)
            const [fromManager] = getAppendables(_from)
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
