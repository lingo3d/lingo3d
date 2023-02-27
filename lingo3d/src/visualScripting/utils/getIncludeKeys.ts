import { forceGet, forceGetInstance } from "@lincode/utils"
import Appendable from "../../api/core/Appendable"
import { getGameGraph } from "../../states/useGameGraph"
import { getGameGraphData } from "../../states/useGameGraphData"
import unsafeGetValue from "../../utils/unsafeGetValue"
import GameGraph from "../GameGraph"

const gameGraphConnectedKeysMap = new WeakMap<
    GameGraph,
    Map<string, Array<string>>
>()
export const getUUIDConnectedKeysMap = () =>
    forceGet(gameGraphConnectedKeysMap, getGameGraph()!, () => {
        const uuidConnectedKeys = new Map<string, Array<string>>()
        for (const data of Object.values(getGameGraphData()[0]!)) {
            if (!("from" in data)) continue
            forceGetInstance(uuidConnectedKeys, data.from, Array).push(
                data.fromProp
            )
            forceGetInstance(uuidConnectedKeys, data.to, Array).push(
                data.toProp
            )
        }
        return uuidConnectedKeys
    })

export const getIncludeKeys = (manager: Appendable) => [
    ...(unsafeGetValue(manager.constructor, "includeKeys") ?? []),
    ...(unsafeGetValue(manager, "runtimeIncludeKeys") ?? []),
    ...(getUUIDConnectedKeysMap().get(manager.uuid) ?? [])
]
