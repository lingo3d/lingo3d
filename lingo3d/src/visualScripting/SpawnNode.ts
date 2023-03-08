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

export default class SpawnNode extends GameGraphChild implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["spawn"]

    private cache?: Array<[GameObjectType, Partial<AppendableNode>]>

    public spawn() {
        if (this.cache) {
            for (const [type, properties] of this.cache)
                Object.assign(createObject(type), properties)
            return
        }
        this.cache = []
        for (const connected of findConnected(this)) {
            const node = serializeAppendable(connected, true)
            const properties = omit(node, nonSerializedProperties)
            Object.assign(createObject(node.type), properties)
            this.cache.push([node.type, properties])
        }
    }
}
