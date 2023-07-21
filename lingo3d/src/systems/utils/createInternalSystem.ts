import { Cancellable } from "@lincode/promiselikes"
import type Appendable from "../../display/core/Appendable"
import { createEffectSystem } from "./createEffectSystem"
import { onDispose } from "../../events/onDispose"
import { onBeforeRender } from "../../events/onBeforeRender"
import { System, SystemOptions } from "./types"

const placeholderFn = () => {}

export default <
    GameObject extends object | Appendable,
    Data extends Record<string, any> | void,
    EventData extends
        | Record<string, any>
        | string
        | boolean
        | number
        | Array<any>
        | Function
        | void
>(
    name: string,
    {
        data,
        effect,
        cleanup,
        update,
        updateTicker = onBeforeRender,
        effectTicker = queueMicrotask,
        beforeTick,
        afterTick,
        sort,
        disableRepeatAdd
    }: SystemOptions<GameObject, Data, EventData>
) => {
    const queued = new Map<GameObject, Data>()

    const [addEffectSystem, deleteEffectSystem] = effect
        ? createEffectSystem(
              effect,
              cleanup,
              effectTicker,
              data ? queued : undefined
          )
        : [placeholderFn, placeholderFn]

    const executeUpdate =
        update &&
        (beforeTick || afterTick
            ? sort
                ? data
                    ? (eventData: EventData | void) => {
                          beforeTick?.(queued)
                          for (const target of [...queued.keys()].sort(sort))
                              update!(target, queued.get(target)!, eventData!)
                          afterTick?.(queued)
                      }
                    : (eventData: EventData | void) => {
                          beforeTick?.(queued)
                          for (const target of [...queued.keys()].sort(sort))
                              update!(target, undefined as any, eventData!)
                          afterTick?.(queued)
                      }
                : data
                ? (eventData: EventData | void) => {
                      beforeTick?.(queued)
                      for (const [target, data] of queued)
                          update!(target, data, eventData!)
                      afterTick?.(queued)
                  }
                : (eventData: EventData | void) => {
                      beforeTick?.(queued)
                      for (const target of queued.keys())
                          update!(target, undefined as any, eventData!)
                      afterTick?.(queued)
                  }
            : sort
            ? data
                ? (eventData: EventData | void) => {
                      for (const target of [...queued.keys()].sort(sort))
                          update!(target, queued.get(target)!, eventData!)
                  }
                : (eventData: EventData | void) => {
                      for (const target of [...queued.keys()].sort(sort))
                          update!(target, undefined as any, eventData!)
                  }
            : data
            ? (eventData: EventData | void) => {
                  for (const [target, data] of queued)
                      update!(target, data, eventData!)
              }
            : (eventData: EventData | void) => {
                  for (const target of queued.keys())
                      update!(target, undefined as any, eventData!)
              })

    let handle: Cancellable | undefined

    const startUpdateLoop =
        update && (() => (handle = updateTicker(executeUpdate!)))

    const autoDelete = !Object.is(updateTicker, onDispose)
    const executeDelete = (item: GameObject) => {
        deleteEffectSystem(item)
        const deleted = queued.delete(item)
        deleted &&
            autoDelete &&
            "$systems" in item &&
            item.$systems.delete(name)
        return deleted
    }

    const deleteSystem = update
        ? (item: GameObject) =>
              executeDelete(item) && queued.size === 0 && handle?.cancel()
        : executeDelete

    const executeAdd = disableRepeatAdd
        ? (item: GameObject, initData?: Data) => {
              if (queued.has(item)) return false
              addEffectSystem(item)
              queued.set(
                  item,
                  initData ??
                      queued.get(item) ??
                      (typeof data === "function"
                          ? data(item)
                          : data
                          ? { ...data }
                          : undefined)
              )
              autoDelete &&
                  "$systems" in item &&
                  item.$systems.set(name, system)
              return true
          }
        : (item: GameObject, initData?: Data) => {
              const added = !queued.has(item)
              addEffectSystem(item)
              queued.set(
                  item,
                  initData ??
                      queued.get(item) ??
                      (typeof data === "function"
                          ? data(item)
                          : data
                          ? { ...data }
                          : undefined)
              )
              added &&
                  autoDelete &&
                  "$systems" in item &&
                  item.$systems.set(name, system)
              return added
          }

    const addSystem = update
        ? (item: GameObject, initData?: Data) =>
              executeAdd(item, initData) &&
              queued.size === 1 &&
              startUpdateLoop!()
        : executeAdd

    const system: System<GameObject, Data> = {
        name,
        add: (item: GameObject, initData?: Data) => {
            if ("done" in item && item.done) return
            addSystem(item, initData)
        },
        delete: deleteSystem,
        dispose: () => {
            for (const [item] of queued) deleteSystem(item)
        },
        get queued() {
            return [...queued.keys()]
        }
    }
    return system
}
