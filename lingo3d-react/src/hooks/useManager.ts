import React, { useContext, useLayoutEffect } from "react"
import useDiffProps from "./useDiffProps"
import { useMemoOnce } from "@lincode/hooks"
import SimpleObjectManager from "lingo3d/lib/display/core/SimpleObjectManager"
import { Cancellable } from "@lincode/promiselikes"
import { forceGet } from "@lincode/utils"
import { Reactive } from "@lincode/reactivity"
import Loaded from "lingo3d/lib/display/core/Loaded"
import processDefaults, { fn } from "../props/utils/processDefaults"
import VisibleObjectManager from "lingo3d/lib/display/core/VisibleObjectManager"

export const ParentContext = React.createContext<
  VisibleObjectManager | Loaded | undefined
>(undefined)

const handleStore = new WeakMap<SimpleObjectManager, Map<string, Cancellable>>()
const makeHandleMap = () => new Map<string, Cancellable>()

export const applyChanges = (
  manager: any,
  changed: Array<[string, any]>,
  removed: Array<string>
) => {
  const handleMap = forceGet(handleStore, manager, makeHandleMap)
  const defaults = processDefaults(manager.constructor.defaults)

  for (const [key, value] of changed) {
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
    manager[key] = value
  }

  for (const key of removed) {
    handleMap.get(key)?.cancel()
    manager[key] = defaults[key]
  }
}

const appendedSet = new WeakSet<any>()

export default (
  p: { children?: React.ReactNode },
  ref: React.ForwardedRef<any>,
  ManagerClass: any
) => {
  const { children, ...props } = p

  const parent = useContext(ParentContext)

  const manager = useMemoOnce(
    () => {
      const manager = new ManagerClass()
      if (parent) {
        parent.append(manager)
        appendedSet.add(manager)
      }
      return manager
    },
    (manager) => {
      const handleMap = handleStore.get(manager)
      if (handleMap) for (const handle of handleMap.values()) handle.cancel()

      manager.dispose()
    }
  )

  useLayoutEffect(() => {
    if (!parent || appendedSet.has(manager)) return
    parent.append(manager)
    appendedSet.add(manager)
  }, [parent])

  const [changed, removed] = useDiffProps(props)
  applyChanges(manager, changed, removed)

  useLayoutEffect(() => {
    if (!ref) return

    if (typeof ref === "function") ref(manager)
    else ref.current = manager
  }, [ref])

  return manager
}
