import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"
import GameGraphChild from "./GameGraphChild"

export default class SpawnNode extends GameGraphChild implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["spawn"]

    public spawn() {
        console.log("spawn")
    }
}
