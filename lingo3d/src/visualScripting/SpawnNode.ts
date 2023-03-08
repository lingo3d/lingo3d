import { omit } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import createObject from "../api/serializer/createObject"
import nonSerializedProperties from "../api/serializer/nonSerializedProperties"
import { serializeAppendable } from "../api/serializer/serialize"
import { AppendableNode, GameObjectType } from "../api/serializer/types"
import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"
import { findConnected } from "./Connector"
import GameGraphChild from "./GameGraphChild"

const spawnCache = new WeakMap<
    Appendable,
    [GameObjectType, Partial<AppendableNode>]
>()

export default class SpawnNode extends GameGraphChild implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["spawn"]

    public spawn() {
        for (const connected of findConnected(this)) {
            if (spawnCache.has(connected)) {
                const [type, properties] = spawnCache.get(connected)!
                Object.assign(createObject(type), properties)
                continue
            }
            const node = serializeAppendable(connected, true)
            const properties = omit(node, nonSerializedProperties)
            Object.assign(createObject(node.type), properties)
            spawnCache.set(connected, [node.type, properties])
        }
    }
}
