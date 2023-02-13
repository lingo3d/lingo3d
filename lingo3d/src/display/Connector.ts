import { Reactive } from "@lincode/reactivity"
import Appendable, { getAppendables } from "../api/core/Appendable"
import IConnector, {
    connectorDefaults,
    connectorSchema
} from "../interface/IConnector"
import getReactive from "../utils/getReactive"
import unsafeSetValue from "../utils/unsafeSetValue"

export default class Connector extends Appendable implements IConnector {
    public static componentName = "connector"
    public static defaults = connectorDefaults
    public static schema = connectorSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const { _from, _to, _fromProp, _toProp } = this
            if (!_from || !_to || !_fromProp || !_toProp) return

            const [fromManager] = getAppendables(_from)
            const [toManager] = getAppendables(_to)

            const fromReactive = getReactive(fromManager, _fromProp)

            const handle = fromReactive.get((val) =>
                unsafeSetValue(toManager, _toProp, val)
            )
            return () => {
                handle.cancel()
            }
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
