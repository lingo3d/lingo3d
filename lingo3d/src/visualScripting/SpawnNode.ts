import Appendable from "../api/core/Appendable"
import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"

export default class SpawnNode extends Appendable implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["spawn"]

    public spawn() {
        console.log("spawn")
    }
}
