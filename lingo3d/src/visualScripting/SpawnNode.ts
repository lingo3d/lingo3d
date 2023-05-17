import { omit } from "@lincode/utils"
import Appendable from "../display/core/Appendable"
import type { GameObjectTypeWithoutTemplate } from "../api/serializer/createObjectWithoutTemplate"
import nonSerializedProperties from "../api/serializer/nonSerializedProperties"
import { AppendableNode } from "../api/serializer/types"
import ISpawnNode, {
    spawnNodeDefaults,
    spawnNodeSchema
} from "../interface/ISpawnNode"
import Connector, { findConnected } from "./Connector"
import GameGraphChild from "./GameGraphChild"
import { managerConnectorsMap } from "../collections/managerConnectorsMap"
import { serializeAppendable } from "../api/serializer/serialize"
import { createObjectWithoutTemplatePtr } from "../pointers/createObjectWithoutTemplatePtr"

type CacheData = Array<
    [Appendable, GameObjectTypeWithoutTemplate, Partial<AppendableNode>]
>
type Cache = { data: CacheData; connectors: Set<Connector> }

const spawnConnectors = (
    connectors: Set<Connector>,
    connectedUUIDs: Map<string, string>
) => {
    for (const { from, to, fromProp, toProp, xyz } of connectors) {
        const connector = Object.assign(new Connector(), {
            from: connectedUUIDs.get(from!),
            fromProp,
            to: connectedUUIDs.get(to!),
            toProp,
            xyz
        })
        connector.$ghost()
    }
}

const spawnCached = (cache: Cache, patch: Map<string, Record<string, any>>) => {
    const { data, connectors } = cache
    const connectedUUIDs = new Map<string, string>()
    for (const [connected, type, properties] of data) {
        const manager = Object.assign(
            createObjectWithoutTemplatePtr[0](type),
            properties,
            patch.get(connected.uuid)
        )
        manager.disableBehavior(true, true, false)
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
    public patch = new Map<string, Record<string, any>>()

    public spawn() {
        if (this.cache) return spawnCached(this.cache, this.patch)
        this.cache = { data: [], connectors: new Set<Connector>() }

        const { data, connectors } = this.cache
        const connectedUUIDs = new Map<string, string>()
        for (const connected of findConnected(this)) {
            for (const connector of managerConnectorsMap.get(connected) ?? [])
                connectors.add(connector)

            const node = serializeAppendable(connected)
            if (node.type === "template") continue

            const properties = omit(node, nonSerializedProperties)
            const manager = Object.assign(
                createObjectWithoutTemplatePtr[0](node.type),
                properties,
                this.patch.get(connected.uuid)
            )
            manager.disableBehavior(true, true, false)
            connectedUUIDs.set(connected.uuid, manager.uuid)
            data.push([connected, node.type, properties])
        }
        spawnConnectors(connectors, connectedUUIDs)
    }
}
