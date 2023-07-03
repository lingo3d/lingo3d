import { Reactive } from "@lincode/reactivity"
import { extendFunction, forceGetInstance, omitFunction } from "@lincode/utils"
import Appendable from "../display/core/Appendable"
import getStaticProperties from "../display/utils/getStaticProperties"
import IConnector, {
    connectorDefaults,
    connectorSchema
} from "../interface/IConnector"
import NullableCallback from "../interface/utils/NullableCallback"
import getReactive from "../utils/getReactive"
import { setRuntimeValue } from "../utils/getRuntimeValue"
import { PointType } from "../typeGuards/isPoint"
import unsafeGetValue from "../utils/unsafeGetValue"
import unsafeSetValue from "../utils/unsafeSetValue"
import GameGraphChild from "./GameGraphChild"
import { uuidMap } from "../collections/idCollections"
import { managerConnectorsMap } from "../collections/managerConnectorsMap"

const connectedMap = new WeakMap<Appendable, Set<Appendable>>()

export const findConnected = (
    manager: Appendable,
    result = new Set<Appendable>()
) => {
    if (result.has(manager)) return result
    result.add(manager)
    for (const connectedManager of connectedMap.get(manager) ?? [])
        findConnected(connectedManager, result)
    return result
}

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
            const { _from, _to, _fromProp, _toProp, _xyz } = this
            if (!_fromProp || !_toProp || !_from || !_to) return

            const fromManager = uuidMap.get(_from)
            const toManager = uuidMap.get(_to)
            if (!fromManager || !toManager) return

            forceGetInstance(connectedMap, fromManager, Set).add(toManager)
            forceGetInstance(connectedMap, toManager, Set).add(fromManager)
            forceGetInstance(managerConnectorsMap, fromManager, Set).add(this)
            forceGetInstance(managerConnectorsMap, toManager, Set).add(this)

            const { defaults } = getStaticProperties(toManager)
            if (
                getStaticProperties(fromManager).defaults[_fromProp] instanceof
                NullableCallback
            ) {
                const cb = _xyz
                    ? (val: PointType) =>
                          setRuntimeValue(
                              toManager,
                              defaults,
                              _toProp,
                              val[_xyz]
                          )
                    : (val: any) =>
                          setRuntimeValue(toManager, defaults, _toProp, val)

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
                setRuntimeValue(toManager, defaults, _toProp, val)
            )
            const handle1 = fromManager.$events.on(
                "runtimeSchema",
                () => this.refreshState.set({})
            )
            const handle2 = toManager.$events.on(
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

    private _to?: string
    public get to() {
        return this._to
    }
    public set to(val) {
        this._to = val
        this.refreshState.set({})
    }

    private _from?: string
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
