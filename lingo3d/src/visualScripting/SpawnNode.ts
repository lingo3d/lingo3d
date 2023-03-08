import { omit } from "@lincode/utils"
import createObject from "../api/serializer/createObject"
import nonSerializedProperties from "../api/serializer/nonSerializedProperties"
import { serializeAppendable } from "../api/serializer/serialize"
import { AppendableNode, GameObjectType } from "../api/serializer/types"
import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"
import Connector, { findConnected, managerConnectorsMap } from "./Connector"
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
        const connectors = new Set<Connector>()
        const connectedUUIDs = new Map<string, string>()
        for (const connected of findConnected(this)) {
            for (const connector of managerConnectorsMap.get(connected) ?? [])
                connectors.add(connector)

            const node = serializeAppendable(connected, true)
            const properties = omit(node, nonSerializedProperties)
            const manager = Object.assign(createObject(node.type), properties)
            connectedUUIDs.set(connected.uuid, manager.uuid)
            this.cache.push([node.type, properties])
        }
        for (const { from, to, fromProp, toProp, xyz } of connectors)
            Object.assign(new Connector(), {
                from: connectedUUIDs.get(from!),
                fromProp,
                to: connectedUUIDs.get(to!),
                toProp,
                xyz
            })
    }
}
