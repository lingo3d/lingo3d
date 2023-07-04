import Appendable from "../../display/core/Appendable"
import { onBeforeRender } from "../../events/onBeforeRender"

export const createEffectSystem = <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void
>(
    effect: (target: GameObject, data: Data) => void | false,
    cleanup: ((target: GameObject, data: Data) => void) | undefined,
    ticker: typeof onBeforeRender | typeof queueMicrotask,
    dataMap?: Map<GameObject, Data>
) => {
    const queued = new Set<GameObject>()
    const needsCleanUp = cleanup && new WeakSet<GameObject>()

    const execute = cleanup
        ? dataMap
            ? () => {
                  for (const target of queued) {
                      const data = dataMap.get(target)!
                      if (needsCleanUp!.has(target)) {
                          cleanup(target, data)
                          needsCleanUp!.delete(target)
                      }
                      effect(target, data) !== false &&
                          needsCleanUp!.add(target)
                  }
                  queued.clear()
                  started = false
              }
            : () => {
                  for (const target of queued) {
                      if (needsCleanUp!.has(target)) {
                          cleanup(target, undefined as any)
                          needsCleanUp!.delete(target)
                      }
                      effect(target, undefined as any) !== false &&
                          needsCleanUp!.add(target)
                  }
                  queued.clear()
                  started = false
              }
        : dataMap
        ? () => {
              for (const target of queued) effect(target, dataMap.get(target)!)
              queued.clear()
              started = false
          }
        : () => {
              for (const target of queued) effect(target, undefined as any)
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
        ? dataMap
            ? (item: GameObject) => {
                  if (needsCleanUp!.has(item)) {
                      cleanup(item, dataMap.get(item)!)
                      needsCleanUp!.delete(item)
                  }
                  queued.delete(item)
              }
            : (item: GameObject) => {
                  if (needsCleanUp!.has(item)) {
                      cleanup(item, undefined as any)
                      needsCleanUp!.delete(item)
                  }
                  queued.delete(item)
              }
        : (item: GameObject) => void queued.delete(item)

    const addSystem = (item: GameObject) => {
        if (queued.has(item)) return
        start()
        queued.add(item)
    }

    return <const>[addSystem, deleteSystem]
}
