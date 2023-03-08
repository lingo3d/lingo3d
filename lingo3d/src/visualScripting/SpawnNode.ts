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
import Connector, { findConnected, managerConnectorsMap } from "./Connector"
import GameGraphChild from "./GameGraphChild"

type CacheData = Array<[Appendable, GameObjectType, Partial<AppendableNode>]>
type Cache = { data: CacheData; connectors: Set<Connector> }

const spawnConnectors = (
    connectors: Set<Connector>,
    connectedUUIDs: Map<string, string>
) => {
    for (const { from, to, fromProp, toProp, xyz } of connectors)
        Object.assign(new Connector(), {
            from: connectedUUIDs.get(from!),
            fromProp,
            to: connectedUUIDs.get(to!),
            toProp,
            xyz
        })
}

const spawnCached = (cache: Cache) => {
    const { data, connectors } = cache
    const connectedUUIDs = new Map<string, string>()
    for (const [connected, type, properties] of data) {
        const manager = Object.assign(createObject(type), properties)
        connectedUUIDs.set(connected.uuid, manager.uuid)
    }
    spawnConnectors(connectors, connectedUUIDs)
}

export default class SpawnNode extends GameGraphChild implements ISpawnNode {
    public static componentName = "spawnNode"
    public static defaults = spawnNodeDefaults
    public static schema = spawnNodeSchema
    public static includeKeys = ["spawn"]

    private cache?: Cache

    public spawn() {
        if (this.cache) return spawnCached(this.cache)
        this.cache = { data: [], connectors: new Set<Connector>() }

        const { data, connectors } = this.cache
        const connectedUUIDs = new Map<string, string>()
        for (const connected of findConnected(this)) {
            for (const connector of managerConnectorsMap.get(connected) ?? [])
                connectors.add(connector)

            const node = serializeAppendable(connected, true)
            const properties = omit(node, nonSerializedProperties)
            const manager = Object.assign(createObject(node.type), properties)
            connectedUUIDs.set(connected.uuid, manager.uuid)
            data.push([connected, node.type, properties])
        }
        spawnConnectors(connectors, connectedUUIDs)
    }
}
