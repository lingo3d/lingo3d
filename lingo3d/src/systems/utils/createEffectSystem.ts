import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"

export const createEffectSystem = <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    effect: (target: GameObject, data: Data) => void | false | (() => void),
    cleanup: ((target: GameObject, data: Data) => void) | undefined,
    ticker: typeof onBeforeRender | typeof queueMicrotask
) => {
    const queued = new Map<GameObject, Data>()
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
              for (const [target, data] of queued) {
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
              for (const [target, data] of queued) {
                  tryRunCleanupCb(target)
                  runEffect(target, data)
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
                  cleanup(item, queued.get(item)!)
                  needsCleanUp!.delete(item)
              }
              tryRunCleanupCb(item)
              queued.delete(item)
          }
        : (item: GameObject) => {
              tryRunCleanupCb(item)
              queued.delete(item)
          }

    const addSystem = (item: GameObject, data: Data) => {
        if (queued.has(item)) {
            queued.set(item, data)
            return
        }
        start()
        queued.set(item, data)
    }

    return <const>[addSystem, deleteSystem]
}
