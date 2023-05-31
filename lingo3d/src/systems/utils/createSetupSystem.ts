import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"

export const createSetupSystem = <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    setup: (target: GameObject, data: Data) => void | false | (() => void),
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

    const execute = cleanup
        ? () => {
              for (const [target, data] of queued) {
                  if (needsCleanUp!.has(target)) {
                      cleanup(target, data)
                      needsCleanUp!.delete(target)
                  }
                  tryRunCleanupCb(target)
                  const result = setup(target, data)
                  result !== false && needsCleanUp!.add(target)
                  typeof result === "function" && cleanupCbs.set(target, result)
              }
              queued.clear()
              started = false
          }
        : () => {
              for (const [target, data] of queued)
                  if (!("done" in target && target.done)) {
                      tryRunCleanupCb(target)
                      const result = setup(target, data)
                      typeof result === "function" &&
                          cleanupCbs.set(target, result)
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
