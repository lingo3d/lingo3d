import { Reactive } from "@lincode/reactivity"
import Appendable, { getAppendables } from "../api/core/Appendable"
import ISpawnConnector, {
    spawnConnectorDefaults,
    spawnConnectorSchema
} from "../interface/ISpawnConnector"

export default class SpawnConnector
    extends Appendable
    implements ISpawnConnector
{
    public static componentName = "spawnConnector"
    public static defaults = spawnConnectorDefaults
    public static schema = spawnConnectorSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const { _from, _to } = this
            const [fromManager] = getAppendables(_from)
            const [toManager] = getAppendables(_to)
            if (!fromManager || !toManager) return
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
}
