import { forceGetInstance } from "@lincode/utils"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import { HitEvent } from "../interface/IVisible"
import renderSystem from "./utils/renderSystem"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import { getAppendablesById } from "../collections/uuidCollections"

const getAppendables = (val: string | Array<string> | undefined) => {
    if (!val) return []
    if (typeof val === "string") return getAppendablesById(val)
    const result: Array<Appendable | MeshAppendable> = []
    for (const id of val)
        for (const appendable of getAppendablesById(id)) result.push(appendable)
    return result
}

const hitCache = new WeakMap<VisibleMixin, WeakSet<VisibleMixin>>()

export const [addHitTestSystem, deleteHitTestSystem] = renderSystem(
    (manager: VisibleMixin) => {
        for (const target of getAppendables(manager.hitTarget)) {
            if (!("object3d" in target!)) return
            const cache = forceGetInstance(hitCache, manager, WeakSet)
            if (manager.hitTest(target)) {
                if (!cache.has(target)) {
                    cache.add(target)
                    manager.onHitStart?.(new HitEvent(target))
                }
                manager.onHit?.(new HitEvent(target))
                continue
            }
            if (!cache.has(target)) continue
            cache.delete(target)
            manager.onHitEnd?.(new HitEvent(target))
        }
    }
)
