import Appendable from "../api/core/Appendable"
import { uuidMap } from "../api/core/collections"
import spawn from "../api/spawn"
import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"

export default class SpawnNode extends Appendable implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["source", "spawn"]

    private target?: Appendable
    private _source?: string
    public get source() {
        return this._source
    }
    public set source(val) {
        this._source = val
        this.target = val ? uuidMap.get(val) : undefined
    }

    public spawn() {
        if (!this.target) return
        return spawn(this.target)
    }
}
