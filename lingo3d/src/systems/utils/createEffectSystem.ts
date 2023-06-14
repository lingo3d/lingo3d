import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"

export const createEffectSystem = <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    effect: (target: GameObject, data: Data) => void | false | (() => void),
    cleanup: ((target: GameObject, data: Data) => void) | undefined,
    ticker: typeof onBeforeRender | typeof queueMicrotask,
    dataMap: Map<GameObject, Data>
) => {
    const queued = new Set<GameObject>()
    const needsCleanUp = cleanup && new WeakSet<GameObject>()
    const cleanupCbs = new WeakMap<GameObject, () => void>()

    const tryRunCleanupCb = (target: GameObject) => {
        if (!cleanupCbs.has(target)) return
        cleanupCbs.get(target)!()
        cleanupCbs.delete(target)
    }

    const runEffect = (target: GameObject, data: Data) => {
        const result = effect(target, data)
        typeof result === "function" && cleanupCbs.set(target, result)
        return result
    }

    const execute = cleanup
        ? () => {
              for (const target of queued) {
                  const data = dataMap.get(target)!
                  if (needsCleanUp!.has(target)) {
                      cleanup(target, data)
                      needsCleanUp!.delete(target)
                  }
                  tryRunCleanupCb(target)
                  runEffect(target, data) !== false && needsCleanUp!.add(target)
              }
              queued.clear()
              started = false
          }
        : () => {
              for (const target of queued) {
                  tryRunCleanupCb(target)
                  runEffect(target, dataMap.get(target)!)
              }
              queued.clear()
              started = false
          }

    let started = false
    const start = () => {
        if (started) return
        started = true
        ticker(execute, true)
    }

    const deleteSystem = cleanup
        ? (item: GameObject) => {
              if (needsCleanUp!.has(item)) {
                  cleanup(item, dataMap.get(item)!)
                  needsCleanUp!.delete(item)
              }
              tryRunCleanupCb(item)
              queued.delete(item)
          }
        : (item: GameObject) => {
              tryRunCleanupCb(item)
              queued.delete(item)
          }

    const addSystem = (item: GameObject) => {
        if (queued.has(item)) return
        start()
        queued.add(item)
    }

    return <const>[addSystem, deleteSystem]
}
