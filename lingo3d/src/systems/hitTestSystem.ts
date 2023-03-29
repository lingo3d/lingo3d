import { forceGetInstance } from "@lincode/utils"
import { getAppendables } from "../api/core/Appendable"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import { HitEvent } from "../interface/IVisible"
import renderSystem from "./utils/renderSystem"

const hitCache = new WeakMap<VisibleMixin, WeakSet<VisibleMixin>>()
export const [addHitTestSystem, deleteHitTestSystem] = renderSystem(
    (manager: VisibleMixin) => {
        for (const target of getAppendables(manager.hitTarget!)) {
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
