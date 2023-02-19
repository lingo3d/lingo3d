import { Reactive } from "@lincode/reactivity"
import { extendFunction, omitFunction } from "@lincode/utils"
import Appendable, { getAppendables } from "../api/core/Appendable"
import IConnector, {
    connectorDefaults,
    connectorSchema
} from "../interface/IConnector"
import NullableCallback from "../interface/utils/NullableCallback"
import getReactive from "../utils/getReactive"
import { PointType } from "../utils/isPoint"
import unsafeGetValue from "../utils/unsafeGetValue"
import unsafeSetValue from "../utils/unsafeSetValue"

export default class Connector extends Appendable implements IConnector {
    public static componentName = "connector"
    public static defaults = connectorDefaults
    public static schema = connectorSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const { _from, _to, _fromProp, _toProp, _xyz } = this
            if (!_from || !_to || !_fromProp || !_toProp) return

            const [fromManager] = getAppendables(_from)
            const [toManager] = getAppendables(_to)

            if (
                unsafeGetValue(fromManager.constructor, "defaults")[
                    _fromProp
                ] instanceof NullableCallback
            ) {
                const cb = _xyz
                    ? (val: PointType) =>
                          unsafeSetValue(toManager, _toProp, val[_xyz])
                    : (val: any) => unsafeSetValue(toManager, _toProp, val)

                const extended = unsafeSetValue(
                    fromManager,
                    _fromProp,
                    extendFunction(unsafeGetValue(fromManager, _fromProp), cb)
                )
                return () => {
                    omitFunction(extended, cb)
                }
            }

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

    private _xyz?: "x" | "y" | "z"
    public get xyz() {
        return this._xyz
    }
    public set xyz(val) {
        this._xyz = val
        this.refreshState.set({})
    }
}
