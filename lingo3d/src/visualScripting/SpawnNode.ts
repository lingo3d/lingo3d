import { omit } from "@lincode/utils"
import createObject from "../api/serializer/createObject"
import nonSerializedProperties from "../api/serializer/nonSerializedProperties"
import { serializeAppendable } from "../api/serializer/serialize"
import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"
import { findConnected } from "./Connector"
import GameGraphChild from "./GameGraphChild"

export default class SpawnNode extends GameGraphChild implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["spawn"]

    public spawn() {
        for (const connected of findConnected(this)) {
            const node = serializeAppendable(connected, true)
            const object = createObject(node.type)
            Object.assign(object, omit(node, nonSerializedProperties))
        }
    }
}
