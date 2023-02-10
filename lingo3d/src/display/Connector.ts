import { Reactive } from "@lincode/reactivity"
import Appendable, { getAppendables } from "../api/core/Appendable"
import unsafeGetValue from "../utils/unsafeGetValue"
import unsafeSetValue from "../utils/unsafeSetValue"

const getReactive = (manager: Appendable, key: string): Reactive<any> => {
    const stateKey = `${key}State`
    let reactive = unsafeGetValue(manager, stateKey)
    if (reactive) return reactive

    unsafeSetValue(
        manager,
        stateKey,
        (reactive = new Reactive<any>(unsafeGetValue(manager, key)))
    )

    const desc = Object.getOwnPropertyDescriptor(manager, key)
    if (!desc) return reactive

    if ("value" in desc)
        Object.defineProperty(manager, key, {
            get() {
                return reactive.get()
            },
            set(value) {
                reactive.set(value)
            }
        })
    else
        Object.defineProperty(manager, key, {
            get() {
                return desc.get!.call(manager)
            },
            set(value) {
                reactive.set(value)
                desc.set!.call(manager, value)
            }
        })
    return reactive
}

export default class Connector extends Appendable {
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
