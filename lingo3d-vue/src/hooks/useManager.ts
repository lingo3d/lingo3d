import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { forceGet } from "@lincode/utils"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import { inject, onUnmounted, provide, Ref, ref, watchEffect, toRaw } from "vue"
import processDefaults, { fn } from "../props/utils/processDefaults"
import useDiffProps from "./useDiffProps"

const handleStore = new WeakMap<SimpleObjectManager, Map<string, Cancellable>>()
const makeHandleMap = () => new Map<string, Cancellable>()

const _applyChanges = (
  manager: any,
  diff: Ref<Array<[string, any]>>,
  defaults: Record<string, any>
) => {
  const handleMap = forceGet(handleStore, manager, makeHandleMap)

  for (const [key, value] of toRaw(diff.value)) {
    handleMap.get(key)?.cancel()

    if (value instanceof Reactive) {
      handleMap.set(
        key,
        value.get((v) => (manager[key] = v))
      )
      continue
    }
    const defaultValue = defaults[key]
    if (defaultValue === fn) {
      if (!value) continue
      if (Array.isArray(value)) manager[key](...value)
      else manager[key](value)
      continue
    }
    manager[key] = value ?? defaultValue
  }
}

export const applyChanges = (
  managerRef: Ref<any | Array<any>> | undefined,
  manager: any | Array<any> | undefined,
  diff: Ref<Array<[string, any]>>,
  defaults: Record<string, any>
) => {
  watchEffect(() => {
    manager ??= toRaw(managerRef?.value)
    if (!manager) return

    if (Array.isArray(manager))
      for (const _manager of manager) _applyChanges(_manager, diff, defaults)
    else _applyChanges(manager, diff, defaults)
  })
}

export default (props: Record<string, any>, ManagerClass: any) => {
  const manager = new ManagerClass()
  const managerRef = ref(manager)
  provide("parent", managerRef)

  const parentRef = inject<Ref<ObjectManager> | undefined>("parent", undefined)
  watchEffect(() => {
    toRaw(parentRef?.value)?.append(manager)
  })

  const defaults = processDefaults(ManagerClass.defaults)
  const diff = useDiffProps(props, defaults)
  applyChanges(undefined, manager, diff, defaults)

  onUnmounted(() => {
    const handleMap = handleStore.get(manager)
    if (handleMap) for (const handle of handleMap.values()) handle.cancel()

    manager.dispose()
  })

  return manager
}
