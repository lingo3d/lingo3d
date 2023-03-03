import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { onBeforeRender } from "../events/onBeforeRender"
import IIncrementNode, {
    incrementNodeDefaults,
    incrementNodeSchema
} from "../interface/IIncrementNode"

export default class IncrementNode
    extends Appendable
    implements IIncrementNode
{
    public static componentName = "incrementNode"
    public static defaults = incrementNodeDefaults
    public static schema = incrementNodeSchema
    public static includeKeys = [
        "paused",
        "initial",
        "step",
        "min",
        "max",
        "out"
    ]

    private refreshState = new Reactive({})

    private _paused = false
    public get paused() {
        return this._paused
    }
    public set paused(value) {
        this._paused = value
        this.refreshState.set({})
    }

    private _initial = 0
    public get initial() {
        return this._initial
    }
    public set initial(value) {
        this._initial = value
        this.out = value
        this.runtimeDefaults = { out: value }
    }

    private _step = 0
    public get step() {
        return this._step
    }
    public set step(value) {
        this._step = value
        this.refreshState.set({})
    }

    private _min = -Infinity
    public get min() {
        return this._min
    }
    public set min(value) {
        this._min = value
        this.refreshState.set({})
    }

    private _max = Infinity
    public get max() {
        return this._max
    }
    public set max(value) {
        this._max = value
        this.refreshState.set({})
    }

    public out = 0

    public constructor() {
        super()
        this.createEffect(() => {
            const { _paused, _initial, _step, _min, _max } = this
            if (_paused || !_step) return

            const handle = onBeforeRender(() => {
                const val = (this.out += _step)
                if (val > _max || val < _min) this.out = _initial
            })
            return () => {
                handle.cancel()
            }
        }, [this.refreshState.get])
    }
}
