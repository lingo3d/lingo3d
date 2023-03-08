import { Reactive } from "@lincode/reactivity"
import { extendFunction, forceGetInstance, omitFunction } from "@lincode/utils"
import Appendable, { getAppendables } from "../api/core/Appendable"
import getStaticProperties from "../display/utils/getStaticProperties"
import IConnector, {
    connectorDefaults,
    connectorSchema
} from "../interface/IConnector"
import NullableCallback from "../interface/utils/NullableCallback"
import getReactive from "../utils/getReactive"
import { setRuntimeValue } from "../utils/getRuntimeValue"
import { PointType } from "../utils/isPoint"
import unsafeGetValue from "../utils/unsafeGetValue"
import unsafeSetValue from "../utils/unsafeSetValue"
import GameGraphChild from "./GameGraphChild"

export const connectedMap = new WeakMap<Appendable, Set<Appendable>>()
export const managerConnectorsMap = new WeakMap<Appendable, Set<Connector>>()

const deleteConnected = (
    fromManager: Appendable,
    toManager: Appendable,
    connector: Connector
) => {
    connectedMap.get(fromManager)?.delete(toManager)
    connectedMap.get(toManager)?.delete(fromManager)
    managerConnectorsMap.get(fromManager)?.delete(connector)
    managerConnectorsMap.get(toManager)?.delete(connector)
}

export default class Connector extends GameGraphChild implements IConnector {
    public static componentName = "connector"
    public static defaults = connectorDefaults
    public static schema = connectorSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const { _from, _to, _fromProp, _toProp, _xyz, _type } = this
            if (!_fromProp || !_toProp) return

            const [fromManager] = getAppendables(_from)
            const [toManager] = getAppendables(_to)
            if (!fromManager || !toManager) return

            forceGetInstance(connectedMap, fromManager, Set).add(toManager)
            forceGetInstance(connectedMap, toManager, Set).add(fromManager)
            forceGetInstance(managerConnectorsMap, fromManager, Set).add(this)
            forceGetInstance(managerConnectorsMap, toManager, Set).add(this)

            if (_type === "spawn") {
                return () => {
                    deleteConnected(fromManager, toManager, this)
                }
            }

            if (
                getStaticProperties(fromManager).defaults[_fromProp] instanceof
                NullableCallback
            ) {
                const cb = _xyz
                    ? (val: PointType) =>
                          setRuntimeValue(toManager, _toProp, val[_xyz])
                    : (val: any) => setRuntimeValue(toManager, _toProp, val)

                const extended = unsafeSetValue(
                    fromManager,
                    _fromProp,
                    extendFunction(unsafeGetValue(fromManager, _fromProp), cb)
                )
                return () => {
                    omitFunction(extended, cb)
                    deleteConnected(fromManager, toManager, this)
                }
            }
            const fromReactive =
                fromManager.runtimeData && _fromProp in fromManager.runtimeData
                    ? getReactive(fromManager.runtimeData, _fromProp)
                    : getReactive(fromManager, _fromProp)

            const handle0 = fromReactive.get((val) =>
                setRuntimeValue(toManager, _toProp, val)
            )
            const handle1 = fromManager.propertyChangedEvent.on(
                "runtimeSchema",
                () => this.refreshState.set({})
            )
            const handle2 = toManager.propertyChangedEvent.on(
                "runtimeSchema",
                () => this.refreshState.set({})
            )
            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                deleteConnected(fromManager, toManager, this)
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

    private _type?: "spawn"
    public get type() {
        return this._type
    }
    public set type(val) {
        this._type = val
        this.refreshState.set({})
    }
}
